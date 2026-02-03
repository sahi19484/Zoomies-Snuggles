import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Load user profile from Firestore
  const loadUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (formData: any) => {
    setAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        name: formData.name,
        email: formData.email,
        userType: formData.userType || 'adopter',
        phone: formData.phone || '',
        location: formData.location || '',
        experience: formData.experience || '',
        uid: user.uid,
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setProfile(userProfile);

      toast.success(`Welcome to Zoomies & Snuggles, ${formData.name}!`);
      return { success: true, data: userCredential };
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please sign in.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format.');
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return { success: true, data: userCredential };
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format.');
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
      await firebaseSignOut(auth);
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
      // Update Firebase Auth profile if name or photo changed
      if (updates.name || updates.photoURL) {
        await firebaseUpdateProfile(user, {
          displayName: updates.name || user.displayName,
          photoURL: updates.photoURL || user.photoURL,
        });
      }

      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updates);

      // Reload profile
      await loadUserProfile(user.uid);

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
      await sendPasswordResetEmail(auth, email);
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
    userName: profile?.name || user?.displayName || 'User',
    userType: profile?.userType || 'adopter',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
