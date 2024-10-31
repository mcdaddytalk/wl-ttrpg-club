"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Import your custom useAuth hook
import Modal from './Modal'; // Import the Modal component
import { Button } from './ui/button';

interface SignInButtonProps {
  mode?: 'modal' | 'inline'; // Accept mode prop
}

const SignInButton: React.FC<SignInButtonProps> = ({ mode = 'inline' }) => {
  const { signInWithOAuth, signInWithOtp, user } = useAuth(); // Ensure useAuth provides the Supabase client
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSignInWithEmail = async () => {
    const response = await signInWithOtp(prompt('Enter your email:') || '');

    if (response.error) {
      console.error('Error signing in with email:', response.error);
    }
    setModalOpen(false); // Close modal after sign-in attempt
  };

  const handleSignInWithGoogle = async () => {
    const response = await signInWithOAuth('google');

    if (response.error) {
      console.error('Sign in error with Google:', response.error);
    } else {
        console.log('User signed in with Google:', user);
    }
    setModalOpen(false); // Close modal after sign-in attempt
  };

  const handleSignInWithDiscord = async () => {
    const response = await signInWithOAuth('discord');

    if (response.error) {
      console.error('Sign in error with Discord:', response.error);
    } else {
      console.log('User signed in with Discord:', user);
    }
    setModalOpen(false); // Close modal after sign-in attempt
  };

  const openModal = () => {
    if (mode === 'modal') {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {mode === 'inline' ? (
        <>
          <Button
            onClick={handleSignInWithEmail}
            className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In with Email
          </Button>
          <Button
            onClick={handleSignInWithGoogle}
            className="mb-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign In with Google
          </Button>
          <Button
            onClick={handleSignInWithDiscord}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Sign In with Discord
          </Button>
        </>
      ) : (
        <Button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In
        </Button>
      )}

      {mode === 'modal' && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold">Sign In</h2>
            <Button
              onClick={handleSignInWithEmail}
              className="mt-4 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign In with Email
            </Button>
            <Button
              onClick={handleSignInWithGoogle}
              className="mb-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign In with Google
            </Button>
            <Button
              onClick={handleSignInWithDiscord}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Sign In with Apple
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SignInButton;
