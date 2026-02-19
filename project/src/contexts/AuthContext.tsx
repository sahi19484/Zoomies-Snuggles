import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  userType: string;
  phone?: string;
  location?: string;
  experience?: string;
  uid: string;
  photoURL?: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
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

// Mock user database stored in localStorage
const USERS_KEY = 'zoomies_users';
const CURRENT_USER_KEY = 'currentUser';

const getAllUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

const saveUser = (profile: UserProfile) => {
  const users = getAllUsers();
  users[profile.email] = profile;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const generateUID = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      try {
        const userProfile = JSON.parse(currentUser);
        setUser(userProfile);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signUp = async (formData: any) => {
    setAuthLoading(true);
    try {
      // Validate form data
      if (!formData.email || !formData.password || !formData.name) {
        throw new Error('Name, email, and password are required.');
      }

      // Check if email already exists
      const users = getAllUsers();
      if (users[formData.email]) {
        throw new Error('This email is already registered. Please sign in.');
      }

      // Validate password strength
      if (formData.password.length < 6) {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid email format.');
      }

      // Create new user profile
      const userProfile: UserProfile = {
        name: formData.name,
        email: formData.email,
        userType: formData.userType || 'adopter',
        phone: formData.phone || '',
        location: formData.location || '',
        experience: formData.experience || '',
        uid: generateUID(),
        photoURL: formData.photoURL || '',
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      saveUser(userProfile);

      // Set as current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
      setUser(userProfile);
      setProfile(userProfile);

      toast.success(`Welcome to Zoomies & Snuggles, ${formData.name}!`);
      return { success: true, data: userProfile };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Sign up failed. Please try again.');
      return { success: false, error };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }

      const users = getAllUsers();
      const user = users[email];

      if (!user) {
        throw new Error('No account found with this email. Please sign up first.');
      }

      // Simple password check (in production, use proper hashing)
      const storedPassword = localStorage.getItem(`password_${email}`);
      if (storedPassword !== password) {
        throw new Error('Incorrect password. Please try again.');
      }

      // Set as current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      setUser(user);
      setProfile(user);

      toast.success('Welcome back!');
      return { success: true, data: user };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Sign in failed. Please try again.');
      return { success: false, error };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
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
      const updatedProfile: UserProfile = {
        ...user,
        ...updates,
        email: user.email, // Don't allow email change
      };

      // Update in users database
      saveUser(updatedProfile);

      // Update current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedProfile));
      setUser(updatedProfile);
      setProfile(updatedProfile);

      toast.success('Profile updated successfully!');
      return { success: true, data: updatedProfile };
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
      const users = getAllUsers();
      if (!users[email]) {
        throw new Error('No account found with this email.');
      }

      // In production, this would send an email
      // For now, we'll just show a success message
      const newPassword = 'TempPass123!';
      localStorage.setItem(`password_${email}`, newPassword);

      toast.success('Password reset! Temporary password: TempPass123! (Check console)');
      console.log('Temporary password for testing:', newPassword);
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
    userName: user?.name || 'User',
    userType: user?.userType || 'adopter',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
