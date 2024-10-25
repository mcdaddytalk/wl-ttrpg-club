"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { Button } from './ui/button';

// import { createClient } from '@/utils/supabase/client';

const UserButton: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const auth = useAuth();
  const { session, signOut } = auth;

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = async () => {
    await signOut(); // Sign out using Supabase
    setDropdownOpen(false);
  };

  const userName = session?.user?.user_metadata?.full_name || 'Guest'; // Get user name from session
  const userAvatar = session?.user?.user_metadata?.avatar_url; // Get user avatar from session

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.user-button')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-button relative">
      <Button onClick={toggleDropdown} className="flex items-center">
        {userAvatar ? (
          <Image src={userAvatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {/* Placeholder for no avatar */}
            <span>{userName.charAt(0)}</span>
          </div>
        )}
        <span className="ml-2">{userName}</span>
      </Button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
          <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
          <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
          <Button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</Button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
