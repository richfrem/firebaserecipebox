
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User, 
  AuthProvider as FirebaseAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { EmailFormValues } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signUpWithEmail: (values: EmailFormValues) => Promise<void>;
  signInWithEmail: (values: EmailFormValues) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithProvider = async (provider: FirebaseAuthProvider) => {
    try {
      // Explicitly set the authDomain to ensure correct origin validation
      auth.config.authDomain = "recipebox-ifiwn.firebaseapp.com";
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
          title: 'Authentication Error',
          description: error.message || 'An unknown error occurred.',
          variant: 'destructive',
      });
    }
  };

  const signInWithGoogle = () => handleSignInWithProvider(googleProvider);
  const signInWithMicrosoft = () => handleSignInWithProvider(microsoftProvider);

  const signUpWithEmail = async ({email, password}: EmailFormValues) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push('/');
    } catch (error: any) {
        console.error("Email sign up error:", error);
        toast({
          title: 'Sign Up Error',
          description: error.message || 'Failed to create an account.',
          variant: 'destructive',
      });
    }
  }

  const signInWithEmail = async ({email, password}: EmailFormValues) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
    } catch (error: any) {
        console.error("Email sign in error:", error);
        toast({
          title: 'Sign In Error',
          description: error.message || 'Failed to sign in.',
          variant: 'destructive',
      });
    }
  }


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
          title: 'Sign Out Error',
          description: error.message || 'Failed to sign out.',
          variant: 'destructive',
      });
    }
  };

  const value = { user, loading, signInWithGoogle, signInWithMicrosoft, signUpWithEmail, signInWithEmail, signOut };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
