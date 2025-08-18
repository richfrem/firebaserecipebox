
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  User, 
  AuthProvider as FirebaseAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { EmailFormValues } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { adminDb } from '@/lib/firebase-admin';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

async function createUserProfile(user: User) {
    const userProfile = {
        id: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous Chef',
        avatar_url: user.photoURL || `https://placehold.co/100x100.png`,
    };
    await setDoc(doc(db, "users", user.uid), userProfile);
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleUser = async (user: User | null) => {
        if (user) {
            setUser(user);
            await createUserProfile(user);
        } else {
            setUser(null);
        }
        setLoading(false);
    }
    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          toast({ title: 'Sign-in Successful', description: `Welcome, ${result.user.displayName}!` });
          handleUser(result.user);
          router.push('/');
        } else {
            // This handles the normal onAuthStateChanged listener
             const unsubscribe = onAuthStateChanged(auth, handleUser);
             return () => unsubscribe();
        }
      })
      .catch((error) => {
        console.error("Authentication redirect result error:", error);
        toast({
          title: 'Authentication Error',
          description: error.message || 'An unknown error occurred during redirect.',
          variant: 'destructive',
        });
         setLoading(false);
      });
      
  }, [router, toast]);

  const handleSignInWithProvider = async (provider: FirebaseAuthProvider) => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Authentication redirect initiation error:", error);
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: email.split('@')[0],
        });
        await createUserProfile(userCredential.user);
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
