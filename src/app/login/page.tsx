"use client";

// import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
    const { session, signInWithOAuth, signInWithOtp } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string>('');

    const handleEmailLogin = async () => {
        setLoading(true);
        const { error } = await signInWithOtp(email);
        if (error) alert('Error logging in: ' + error.message);
        else alert('Check your email for a login link!');
        setLoading(false);
    };

    const handleProviderLogin = async (provider: 'google' | 'apple') => {
        setLoading(true);
        const { error } = await signInWithOAuth(provider);
        if (error) alert('Error logging in: ' + error.message);
        setLoading(false);
    };

    useEffect(() => {
        // Redirect user if already logged in
        if (session) router.push('/dashboard');
    }, [router, session]);

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Email</label>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleEmailLogin} disabled={loading}>
          Send Magic Link
        </button>
      </div>
      <div>
        <button onClick={() => handleProviderLogin('google')} disabled={loading}>
          Sign in with Google
        </button>
        <button onClick={() => handleProviderLogin('apple')} disabled={loading}>
          Sign in with Apple
        </button>
      </div>
    </div>
  );
}
