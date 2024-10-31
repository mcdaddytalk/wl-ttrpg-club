"use client";

// import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Provider } from '@/lib/types/supabase';

import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';

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

    const handleProviderLogin = async (provider: Provider) => {
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
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white dark:bg-gray-800p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Welcome! Please Sign In
        </h2>
        
        {/* Google Sign-in Button */}
        <Button
          onClick={() => handleProviderLogin('google')}
          disabled={loading}
          variant="outline"  // Adjust variant as desired
          className="flex items-center justify-center w-full mb-4 text-gray-600 dark:text-gray-200 dark:bg-gray-700"
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign in with Google
        </Button>
        
        {/* Discord Sign-in Button */}
        <Button
          onClick={() => handleProviderLogin("discord")}
          className="flex items-center justify-center w-full mb-4 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <FaDiscord className="text-2xl mr-2" />
          Sign in with Discord
        </Button>

        {/* Email Sign-In */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Or sign in with your email:</p>
          <form className="space-y-4">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleEmailLogin} disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Send Magic Link
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
