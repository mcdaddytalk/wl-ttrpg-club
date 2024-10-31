"use client";
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AuthOtpResponse, OAuthResponse, Session, SignInWithOAuthCredentials, SignInWithPasswordlessCredentials, User } from '@supabase/supabase-js';
import { Provider } from '@/lib/types/supabase';

type Auth = {
    session: Session | null;
    user: User | null;
    signOut: () => Promise<void>;
    signInWithOtp: (email: string) => Promise<AuthOtpResponse>;
    signInWithOAuth: (provider: Provider) => Promise<OAuthResponse>;
    // Add more auth-related functions here if needed    
};

export function useAuth(): Auth {
    const supabase = createClient();
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    // Sign out function
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
        setSession(null); // Clear session on sign out
    };

    const signInWithOtp = async (email: string): Promise<AuthOtpResponse> => {
        const credentials: SignInWithPasswordlessCredentials = {
            email
        };
        const response = await supabase.auth.signInWithOtp(credentials);
        if (response.error) {
            console.error('Error signing in with OTP:', response.error);
        }
        return response;
    }

    const signInWithOAuth = async (provider: Provider): Promise<OAuthResponse> => {
        const credentials: SignInWithOAuthCredentials = {
            provider
        }
        if (provider === 'discord') {
            credentials['options'] = { redirectTo: 'http://localhost:3000/auth/callback' };
        }
        // Sign in with OAuth
        const response = await supabase.auth.signInWithOAuth(credentials);
        if (response.error) {
            console.error('Error signing in with OAuth:', response.error);
        }
        return response;
    }
    // Return an object with session and auth functions
    return {
        session,
        user,
        signOut,
        signInWithOtp,
        signInWithOAuth
        // You can add more auth-related functions here if needed
    };
}
