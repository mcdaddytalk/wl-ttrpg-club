"use client";

import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component
import { Button } from './ui/button';
import Link from 'next/link';
import { 
  signInWithOTP, 
  //signInWithProvider 
} from '@/server/authActions';
import { OAuthButtons } from './OAuthButtons';
import PasswordlessButton from './PasswordlessButton';

interface SignInButtonProps {
  mode?: 'modal' | 'inline'; // Accept mode prop
}



const SignInButton: React.FC<SignInButtonProps> = ({ mode = 'inline' }) => {
  const [isModalOpen, setModalOpen] = useState(false);
 
  const handleSignInWithEmail = async (formData: FormData) => {
    const email = formData.get('email') as string;
    await signInWithOTP(email);    
    setModalOpen(false); // Close modal after sign-in attempt
  };

  // const handleSignInWithGoogle = async () => {
  //   await signInWithProvider('google');
  //   setModalOpen(false); // Close modal after sign-in attempt
  // };

  // const handleSignInWithDiscord = async () => {
  //   await signInWithProvider('discord');
  //   setModalOpen(false); // Close modal after sign-in attempt
  // };

  const openModal = () => {
    if (mode === 'modal') {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const SignupText = "Need an account? Sign Up"

  return (
    <div className="flex flex-col items-center mt-1">
      {mode === 'inline' ? (
        <>
          <PasswordlessButton useLabel handleSignInWithEmail={handleSignInWithEmail} />
          <OAuthButtons setModalOpen={setModalOpen} />
          <Link
              href="/signup"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {SignupText}
          </Link>
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
            <h2 className="text-lg font-semibold dark:text-slate-800 text-slate-100">Sign In</h2>
            <PasswordlessButton handleSignInWithEmail={handleSignInWithEmail} />
            <OAuthButtons setModalOpen={setModalOpen} />
            <Button asChild className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800">
              <Link
                href="/signup"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default to ensure `closeModal` logic runs.
                  setModalOpen(false);
                  window.location.href = "/signup"; // Redirect to signup after modal close.
                }}
              >
                {SignupText}
              </Link>
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SignInButton;
