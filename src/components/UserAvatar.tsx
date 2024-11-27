// components/Avatar.tsx
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarProps {
  avatarUrl?: string;
  fullName: string;
}

const UserAvatar: React.FC<AvatarProps> = ({ avatarUrl, fullName }) => {
  const getInitials = () => {
    const names = fullName.trim().split(" ");
    const initials = names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : `${names[0][0]}`;
    return initials.toUpperCase();
  };

  // console.log(`AvatarUrl:  ${avatarUrl}`)

  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={avatarUrl} alt={`${fullName}`} />
      <AvatarFallback className="bg-slate-200 text-slate-600 text-xl font-bold">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
