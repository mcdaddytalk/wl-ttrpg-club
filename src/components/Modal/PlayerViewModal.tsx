"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { Player } from "@/lib/types/custom";
interface PlayerViewModalProps {
    isOpen: boolean;
    onCancel: () => void;
    player: Player;
}

const PlayerViewModal: React.FC<PlayerViewModalProps> = ({ 
    player,
    isOpen,
    onCancel
}) => {
  const fullName = `${player.given_name} ${player.surname}`;
  const experienceBadge = player.isMinor ? "🌟 Minor" : player.experienceLevel;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogTrigger asChild>
        <Button variant="outline">View Player</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{fullName}</DialogTitle>
        </DialogHeader>
        <DialogDescription>View Player Details</DialogDescription>
        <div className="flex items-center gap-4">
          <UserAvatar avatarUrl={player.avatar} fullName={fullName} size={16} />
          <div>
            <p className="text-lg font-semibold">{fullName}</p>
            <Badge variant="secondary">{experienceBadge}</Badge>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className={cn("flex items-center", player.status_icon && "gap-2")}>
              {player.status_icon}
              {player.status}
            </span>
          </div>
          {player.statusNote && (
            <div>
              <span className="font-medium">Status Note:</span>
              <p className="text-sm text-muted-foreground">{player.statusNote}</p>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{player.email}</span>
          </div>
          {player.phoneNumber && (
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{player.phoneNumber}</span>
            </div>
          )}
        </div>
        <Separator className="my-4" />
        <Button className="w-full" onClick={onCancel}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerViewModal;