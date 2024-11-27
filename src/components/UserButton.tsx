"use client";

import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
import { Button } from './ui/button';
import UserAvatar from './UserAvatar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { getUser, signOut } from '@/server/authActions';
// import { User } from 'lucide-react';

// import { createClient } from '@/utils/supabase/client';

const UserButton: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // const [roles, setRoles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      // const roles = await getUserRoles();
      if (!user) {
        router.push('/');
      }
      setUser(user);
      // setRoles(roles);
    };
    fetchUser();
  }, [router]);

  const menuLinks = [
    { href: '/member/change-password', label: 'Change Password', roles: ['member'] },
    { href: '/member/profile', label: 'Profile', roles: ['member'] },
    { href: '/member/dashboard', label: 'Dashboard', roles: ['member'] },
    { href: '/games', label: 'Games Dashboard', roles: ['member'] },
    { href: '/gamemaster', label: 'Gamemaster Dashboard', roles: ['gamemaster'] },
    { href: '/admin', label: 'Admin Dashboard', roles: ['admin'] },
  ];

  
  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = async () => {
    await signOut(); //
    setDropdownOpen(false);
    router.push('/');
  };

  const userName = user?.user_metadata?.given_name 
    && user?.user_metadata?.given_name != null 
    ? user?.user_metadata?.given_name + ' ' + user?.user_metadata?.surname 
    : user?.user_metadata?.full_name;
  const userAvatar = user?.user_metadata?.avatar_url; // Get user avatar from session
  
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
      <Button onClick={toggleDropdown} className="flex items-center bg-slate-800 hover:bg-slate-500 dark:bg-slate-400 hover:dark:bg-slate-200">
        {/* {userAvatar ? (
          <Image src={userAvatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
            <span>{userName.charAt(0)}</span>
          </div>
        )} */}
        { user ? ( 
          <>
            <UserAvatar avatarUrl={userAvatar} fullName={userName} /> 
            <span className="ml-2">{userName}</span>  
          </>
        ) : (
          <>
            <span className="ml-2">Logging in...</span>
          </>
        )}        
      </Button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
          {menuLinks.map(link => (
            user?.user_metadata?.roles.some((role: string) => link.roles.includes(role)) && (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => toggleDropdown()}
                className="block px-4 py-2 hover:bg-slate-200 dark:text-black"
              >
                {link.label}
              </Link>
            )
          ))}
          <Button onClick={handleLogout} className="block w-full text-left px-4 py-2  bg-slate-800 hover:bg-slate-500 dark:bg-slate-400 hover:dark:bg-slate-200">Logout</Button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
