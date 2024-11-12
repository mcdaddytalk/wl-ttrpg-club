"use client";

// import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"

import { Provider } from '@/lib/types/custom';
// import { toast } from "sonner"

import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';
import { 
// signInWithOTP,
  signInWithPassword,
  signInWithProvider 
} from '@/server/authActions';
import Link from 'next/link';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleEmailLogin = async () => {
        setLoading(true);
        await signInWithPassword(email, password);
        // toast.success('Check your email for a login link!');
        setLoading(false);
    };

    const handleProviderLogin = async (provider: Provider) => {
        setLoading(true);
        await signInWithProvider(provider);
        setLoading(false);
    };
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full" 
              />
            </div>
            <Button onClick={handleEmailLogin} disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Send Magic Link
            </Button>
          </form>
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
        </CardContent>
        <CardFooter>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>    
  );
}
