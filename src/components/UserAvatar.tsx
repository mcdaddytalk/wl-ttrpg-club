// components/Avatar.tsx
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useSupabaseBrowserClient from "@/utils/supabase/client";

interface AvatarProps {
  avatarUrl?: string;
  fullName: string;
  size?: 1 | 2 | 4 | 8 | 12 | 16 | 20 | 32 | 48 | 64;
}

const UserAvatar: React.FC<AvatarProps> = ({ avatarUrl, fullName, size=8 }) => {
  const getInitials = () => {
    const names = fullName.trim().split(" ");
    const initials = names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : `${names[0][0]}`;
    return initials.toUpperCase();
  };

  const supabase = useSupabaseBrowserClient();
  let avatar = avatarUrl;
  if (avatar && !avatar.startsWith('https://')) {
    avatar = supabase.storage.from('avatars').getPublicUrl(avatar).data.publicUrl;
  }

  return (
    <Avatar className={`w-${size} h-${size}`}>
      <AvatarImage src={avatar} alt={`${fullName}`} />
      <AvatarFallback className="bg-slate-200 text-slate-600 text-xl font-bold">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
