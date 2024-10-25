"use client"

import React from 'react';
import { useAuth } from '@/hooks/useAuth'; // Import your custom useAuth hook
import UserButton from './UserButton'; // Import UserButton for signed-in users

type SignedOutProps = {
    children: React.ReactNode;
}
const SignedOut: React.FC<SignedOutProps> = ({children}) => {
  const { session } = useAuth();

  return (
    <div className="app-container">
        {session ? (
            <UserButton />
        ) : (
            <>
            {children}
            </>
        )}
    </div>
  );
};

export default SignedOut;
