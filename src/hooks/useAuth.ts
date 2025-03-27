"use client";
// hooks/useAuth.ts
import { useEffect, useState, useCallback } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { Provider } from '@/lib/types/custom';
import { 
    // getInitialSession,
    getUser,
    signInWithPassword,
    signInWithProvider,
    signInWithOTP,
    signOut,
    getInitialSession
} from '@/server/authActions';
import logger from '@/utils/logger';

interface AuthContext {
    session: Session | null;
    user: User | null;
    roles: string[];
    error: string | null;
    signOut: () => Promise<void>;
    signInWithOTP: (email: string) => Promise<void>;
    signInWithProvider: (provider: Provider) => Promise<void>;
    signInWithPassword: (email: string, password: string) => Promise<void>;
    clearError: () => void;
    // Add more auth-related functions here if needed    
};

export function useAuth(): AuthContext {
    const [session, setSession] = useState<Session | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    // const supabaseClient = createClient();
    // const router = useRouter();
    
    const refreshSession = useCallback(async () => {
        const { session } = await getInitialSession();
        setSession(session);
        const user = await getUser();
        setUser(user);
    }, [])

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await refreshSession();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
                setError("Failed to initialize authentication")
            }
          };
      
          initializeAuth();          
    }, [refreshSession]);

    // useEffect(() => {
    //   const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
    //     setSession(session);
    //     setUser(session?.user ?? null);
    //     if (!session) router.push('/'); // Redirect to sign-in if session is null
    //   });
    
    //   return () => {
    //     authListener.subscription.unsubscribe();
    //   };
    // }, [supabaseClient, router]);

    // Sign out function
    const handleSignInWithPassword = useCallback(async (email: string, password: string) => {
        try {
          await signInWithPassword(email, password);
          setError(null);
          await refreshSession(); // Refresh session state after sign-in
        } catch (error: unknown) {
          logger.error(error);
          setError(error instanceof AuthError ? error.message : "An error occurred during password sign-in");
        }
      }, [refreshSession]);
    
      const handleSignInWithProvider = useCallback(async (provider: 'discord' | 'google') => {
        try {
          await signInWithProvider(provider);
          setError(null);
          await refreshSession(); // Refresh session state after sign-in
        } catch (error: unknown) {
            logger.error(error);
            setError(error instanceof AuthError ? error.message : "An error occurred during OAuth sign-in");
        }
      }, [refreshSession]);
    
      const handleSignInWithOTP = useCallback(async (email: string) => {
        try {
          await signInWithOTP(email);
          setError(null);
          await refreshSession(); // Refresh session state after sign-in
        } catch (error: unknown) {
            logger.error(error);
            setError(error instanceof AuthError ? error.message : "An error occurred during Passwordless sign-in");
        }
      }, [refreshSession]);
    
      const handleSignOut = useCallback(async () => {
        try {
          await signOut();
        } catch (error: unknown) {
            setError(error instanceof AuthError ? error.message : "An error occurred during signout");
        } finally {
          setSession(null);
          setUser(null);
          setRoles([])
          setError(null);
          await refreshSession();
        }
      }, [refreshSession]);

      const clearError = useCallback(() => {
        setError(null);
      }, []);
    
      return {
        session,
        user,
        roles,
        error,
        signInWithPassword: handleSignInWithPassword,
        signInWithProvider: handleSignInWithProvider,
        signInWithOTP: handleSignInWithOTP,
        signOut: handleSignOut,
        clearError
      };
}
