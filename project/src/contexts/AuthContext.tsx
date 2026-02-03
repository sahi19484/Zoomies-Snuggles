import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  user_type: string;
  phone?: string;
  location?: string;
  experience?: string;
  photo_url?: string;
  created_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  authLoading: boolean;
  signUp: (formData: any) => Promise<{ success: boolean; data?: any; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  updateProfile: (updates: any) => Promise<{ success: boolean; data?: any; error?: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
  isAuthenticated: boolean;
  userEmail: string | null | undefined;
  userName: string;
  userType: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Load user profile from Supabase
  const loadUserProfile = async (authId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user || null);
          if (session?.user) {
            await loadUserProfile(session.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (formData: any) => {
    setAuthLoading(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw authError;
      }

      const authUser = authData.user;
      if (!authUser) {
        throw new Error('Failed to create user account');
      }

      // Create user profile in database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          auth_id: authUser.id,
          email: formData.email,
          name: formData.name,
          user_type: formData.userType || 'adopter',
          phone: formData.phone || null,
          location: formData.location || null,
          experience: formData.experience || null,
          photo_url: null,
        });

      if (profileError) {
        throw profileError;
      }

      toast.success(`Welcome to Zoomies & Snuggles, ${formData.name}!`);
      return { success: true, data: authUser };
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in.');
      } else if (error.message.includes('weak')) {
        toast.error('Password is too weak. Please use at least 6 characters.');
      } else {
        toast.error(error.message || 'Sign up failed. Please try again.');
      }
      return { success: false, error };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Welcome back!');
      return { success: true, data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message.includes('Invalid login')) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.error(error.message || 'Sign in failed. Please try again.');
      }
      return { success: false, error };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      setUser(null);
      setProfile(null);
      toast.success('You have been signed out successfully.');
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed. Please try again.');
      return { success: false, error };
    }
  };

  // Update profile function
  const updateProfile = async (updates: any) => {
    if (!user) {
      toast.error('You must be signed in to update your profile.');
      return { success: false, error: new Error('Not authenticated') };
    }

    setAuthLoading(true);
    try {
      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('auth_id', user.id);

      if (error) {
        throw error;
      }

      // Reload profile
      await loadUserProfile(user.id);

      toast.success('Profile updated successfully!');
      return { success: true, data: updates };
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile. Please try again.');
      return { success: false, error };
    } finally {
      setAuthLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset email.');
      return { success: false, error };
    } finally {
      setAuthLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    authLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user,
    userEmail: user?.email,
    userName: profile?.name || user?.email?.split('@')[0] || 'User',
    userType: profile?.user_type || 'adopter',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
