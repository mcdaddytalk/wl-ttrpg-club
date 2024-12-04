"use client";

import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
import { Button } from './ui/button';
import UserAvatar from './UserAvatar';
import Link from 'next/link';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { MessageData, MessageDO } from '@/lib/types/custom';
import { fetchMessages } from '@/queries/fetchMessages';
import useSupabaseBrowserClient from '@/utils/supabase/client';

interface UserButtonProps {
  user: User;
}

const UserButton = ({ user }: UserButtonProps): React.ReactElement => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = useSupabaseBrowserClient();
  
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
    fetch(
      '/auth/signout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(() => {
      toast.success('Logout successful');
    }).catch((error) => {
      toast.error(`Logout failed - ${error.message}`);
    }).finally(() => {
      window.location.reload();
      setDropdownOpen(false);
    })
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

  const { data: receivedMessages, isLoading: messagesLoading, isError: messagesHasError, error: messagesError } = useQuery<MessageDO[]>({
    queryKey: ['messages', 'unread', user.id],
    queryFn: () => fetchMessages(user.id, 'unread'),    
    initialData: [],
    enabled: !!user?.id,
  });

  if (messagesHasError) {
    console.error(messagesError);
  }

  
  useEffect(() => {
    if (receivedMessages) {
      const unreadMessages = receivedMessages.filter(message => !message.is_read);
      setUnreadCount(unreadMessages.length);
    }

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload: { new: MessageData; }) => {
          const message = payload.new as MessageData;
          if (message.recipient_id === user?.id && message.is_read === false) {
            setUnreadCount(prev => prev + 1);
          }
        })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };

  }, [receivedMessages, supabase, user?.id]);

  
  if (messagesLoading) {
    return (
      <div className="user-button relative">
        <Button onClick={toggleDropdown} className="flex items-center bg-slate-800 hover:bg-slate-500 dark:bg-slate-400 hover:dark:bg-slate-200">
          <span className="ml-2">Loading...</span>
        </Button>
      </div>
    );
  }

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
            { unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                {unreadCount}
              </span>
            )}
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
          <Button asChild className='block w-full bg-blue-600 hover:bg-blue-500 dark:bg-blue-400 hover:dark:bg-blue-200'>
            <Link key="messages" href="/member/messages" onClick={() => toggleDropdown()}>
              Messages
              { unreadCount > 0 && (
                <span className="top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 ml-2">
                  {unreadCount}
                </span>
              )}
            </Link>
          </Button>
          <Button onClick={handleLogout} className="block w-full text-left px-4 py-2  bg-slate-800 hover:bg-slate-500 dark:bg-slate-400 hover:dark:bg-slate-200">Logout</Button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
