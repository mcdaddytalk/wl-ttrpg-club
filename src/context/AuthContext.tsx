"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Ensure you have the Supabase client setup
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  signOut: () => Promise<void>;
  publishableKey: string; // Added to context
  signInFallbackRedirectUrl?: string; // Optional redirect URL
  signUpFallbackRedirectUrl?: string; // Optional redirect URL
}

interface AuthProviderProps {
  children: React.ReactNode;
  publishableKey: string; // Supabase anon key
  signInFallbackRedirectUrl?: string; // Optional sign-in redirect URL
  signUpFallbackRedirectUrl?: string; // Optional sign-up redirect URL
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  publishableKey,
  signInFallbackRedirectUrl,
  signUpFallbackRedirectUrl,
}) => {
  const supabase = createClient(); // Create Supabase client
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setSession(null); // Clear session on sign out
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signOut,
        publishableKey,
        signInFallbackRedirectUrl,
        signUpFallbackRedirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
