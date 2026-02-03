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
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Initialize auth state
  useEffect(() => {
    setLoading(true);

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
      } catch (error) {
        console.error('Auth init error:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (formData: any) => {
    setAuthLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const authUser = authData.user;
      if (!authUser) throw new Error('Failed to create user');

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
        });

      if (profileError) throw profileError;

      toast.success(`Welcome to Zoomies & Snuggles, ${formData.name}!`);
      return { success: true, data: authUser };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Sign up failed');
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

      if (error) throw error;

      toast.success('Welcome back!');
      return { success: true, data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Sign in failed');
      return { success: false, error };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed');
      return { success: false, error };
    }
  };

  // Update profile function
  const updateProfile = async (updates: any) => {
    if (!user) {
      toast.error('You must be signed in');
      return { success: false, error: new Error('Not authenticated') };
    }

    setAuthLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('auth_id', user.id);

      if (error) throw error;

      toast.success('Profile updated!');
      return { success: true, data: updates };
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
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

      if (error) throw error;

      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error: any) {
      console.error('Reset error:', error);
      toast.error('Failed to send reset email');
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
