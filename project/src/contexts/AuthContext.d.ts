import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    user_type?: string;
  };
}

export interface Profile {
  name: string;
  email: string;
  user_type: string;
  phone?: string;
  location?: string;
  experience?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  authLoading: boolean;
  signUp: (formData: any) => Promise<{ success: boolean; data?: any; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  updateProfile: (updates: any) => Promise<{ success: boolean; data?: any; error?: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
  signInWithGoogle: () => Promise<{ success: boolean; data?: any; error?: any }>;
  signInWithApple: () => Promise<{ success: boolean; data?: any; error?: any }>;
  sendPhoneOtp: (phoneNumber: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  verifyPhoneOtp: (phoneNumber: string, otp: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isOrganization: () => boolean;
  isAuthenticated: boolean;
  userEmail: string | undefined;
  userName: string;
  userType: string;
}

export function useAuth(): AuthContextType;

export const AuthProvider: React.FC<{ children: ReactNode }>;

declare const AuthContext: React.Context<AuthContextType>;
export default AuthContext;
