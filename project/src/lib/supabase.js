import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            user_type: userData.userType || 'adopter',
            phone: userData.phone,
            location: userData.location,
            experience: userData.experience,
          }
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  },

  // Sign in existing user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      console.error('Get user error:', error)
      return { user: null, error }
    }
  },

  // Update user profile
  updateProfile: async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { data: null, error }
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  }
}

// Database helper functions
export const dbHelpers = {
  // User profile functions
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { data: null, error }
    }
  },

  createUserProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Create user profile error:', error)
      return { data: null, error }
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update user profile error:', error)
      return { data: null, error }
    }
  },

  // Pet functions
  getPets: async (filters = {}) => {
    try {
      let query = supabase
        .from('pets')
        .select(`
          *,
          pet_images:pet_images(*)
        `)
        .eq('status', 'available')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.species) {
        query = query.eq('species', filters.species)
      }
      if (filters.size) {
        query = query.eq('size', filters.size)
      }
      if (filters.is_featured) {
        query = query.eq('is_featured', true)
      }

      const { data, error } = await query
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get pets error:', error)
      return { data: null, error }
    }
  },

  getPetById: async (petId) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          pet_images:pet_images(*),
          medical_records:medical_records(*)
        `)
        .eq('id', petId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get pet by ID error:', error)
      return { data: null, error }
    }
  },

  // Community functions
  getCommunityPosts: async (category = null) => {
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          author:profiles(name, user_type),
          post_replies:post_replies(count)
        `)
        .eq('status', 'active')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get community posts error:', error)
      return { data: null, error }
    }
  },

  createPost: async (postData) => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...postData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Create post error:', error)
      return { data: null, error }
    }
  },

  // Events functions
  getEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles(name),
          registrations:event_registrations(count)
        `)
        .gte('date', new Date().toISOString().split('T')[0])
        .eq('status', 'scheduled')
        .order('date', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get events error:', error)
      return { data: null, error }
    }
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Subscribe to pets table changes
  subscribeToPets: (callback) => {
    return supabase
      .channel('pets_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pets' }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to community posts
  subscribeToPosts: (callback) => {
    return supabase
      .channel('posts_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'community_posts' }, 
        callback
      )
      .subscribe()
  }
}

export default supabase
