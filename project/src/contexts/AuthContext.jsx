import React, { createContext, useContext, useEffect, useState } from 'react'
import { authHelpers, dbHelpers, subscriptions } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user } = await authHelpers.getCurrentUser()
        if (user) {
          setUser(user)
          await loadUserProfile(user.id)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Subscribe to auth changes
    const authSub = subscriptions.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)

      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      // unsubscribe safely
      try {
        const subscription = authSub?.data?.subscription || authSub?.subscription
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.warn('Error unsubscribing auth subscription', err)
      }
    }
  }, [])

  // Load user profile from database
  const loadUserProfile = async (userId) => {
    try {
      const { data: profileData } = await dbHelpers.getUserProfile(userId)
      if (profileData) {
        setProfile(profileData)
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile } = await dbHelpers.createUserProfile(userId, {
          name: user?.user_metadata?.name || 'User',
          user_type: user?.user_metadata?.user_type || 'adopter',
          email: user?.email
        })
        setProfile(newProfile)
      }
    } catch (error) {
      console.error('Load profile error:', error)
    }
  }

  // Sign up function
  const signUp = async (formData) => {
    setAuthLoading(true)
    try {
      const { data, error } = await authHelpers.signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          userType: formData.userType,
          phone: formData.phone,
          location: formData.location,
          experience: formData.experience
        }
      )

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('An account with this email already exists. Please sign in instead.')
        } else {
          toast.error(error.message || 'Sign up failed. Please try again.')
        }
        return { success: false, error }
      }

      if (data.user) {
        toast.success('Account created successfully! Please check your email to verify your account.')
        return { success: true, data }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign in function
  const signIn = async (email, password) => {
    setAuthLoading(true)
    try {
      const { data, error } = await authHelpers.signIn(email, password)

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials and try again.')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address before signing in.')
        } else {
          toast.error(error.message || 'Sign in failed. Please try again.')
        }
        return { success: false, error }
      }

      if (data.user) {
        toast.success(`Welcome back!`)
        return { success: true, data }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await authHelpers.signOut()
      if (error) {
        toast.error('Sign out failed. Please try again.')
        return { success: false, error }
      }

      toast.success('You have been signed out successfully.')
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('An unexpected error occurred during sign out.')
      return { success: false, error }
    }
  }

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setAuthLoading(true)

      // Update auth metadata
      const { error: authError } = await authHelpers.updateProfile(updates)
      if (authError) throw authError

      // Update profile in database
      const { data, error: dbError } = await dbHelpers.updateUserProfile(user.id, updates)
      if (dbError) throw dbError

      setProfile(data)
      toast.success('Profile updated successfully!')
      return { success: true, data }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setAuthLoading(true)
      const { error } = await authHelpers.resetPassword(email)
      
      if (error) {
        toast.error(error.message || 'Failed to send reset email.')
        return { success: false, error }
      }

      toast.success('Password reset email sent! Check your inbox.')
      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return profile?.user_type === role
  }

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin')
  }

  // Check if user is organization
  const isOrganization = () => {
    return hasRole('organization')
  }

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    setAuthLoading(true)
    try {
      const { data, error } = await authHelpers.signInWithGoogle()
      if (error) {
        toast.error(error.message || 'Google sign in failed')
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Google sign in error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign in with Apple OAuth
  const signInWithApple = async () => {
    setAuthLoading(true)
    try {
      const { data, error } = await authHelpers.signInWithApple()
      if (error) {
        toast.error(error.message || 'Apple sign in failed')
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Apple sign in error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Send OTP to phone number
  const sendPhoneOtp = async (phoneNumber) => {
    setAuthLoading(true)
    try {
      const { data, error } = await authHelpers.signInWithPhoneOtp(phoneNumber)
      if (error) {
        toast.error(error.message || 'Failed to send OTP')
        return { success: false, error }
      }
      toast.success('OTP sent to your phone number')
      return { success: true, data }
    } catch (error) {
      console.error('Send OTP error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Verify phone OTP
  const verifyPhoneOtp = async (phoneNumber, otp) => {
    setAuthLoading(true)
    try {
      const { data, error } = await authHelpers.verifyPhoneOtp(phoneNumber, otp)
      if (error) {
        toast.error(error.message || 'Invalid OTP. Please try again.')
        return { success: false, error }
      }
      toast.success('Phone verified successfully!')
      return { success: true, data }
    } catch (error) {
      console.error('Verify OTP error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      return { success: false, error }
    } finally {
      setAuthLoading(false)
    }
  }

  const value = {
    // State
    user,
    profile,
    loading,
    authLoading,

    // Auth functions
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    signInWithGoogle,
    signInWithApple,
    sendPhoneOtp,
    verifyPhoneOtp,

    // Utility functions
    hasRole,
    isAdmin,
    isOrganization,

    // User info
    isAuthenticated: !!user,
    userEmail: user?.email,
    userName: profile?.name || user?.user_metadata?.name || 'User',
    userType: profile?.user_type || user?.user_metadata?.user_type || 'adopter'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
