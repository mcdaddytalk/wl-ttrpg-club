"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import fetcher from "@/utils/fetcher";
import { Label } from "recharts";

interface InvitePlayerModalProps {
  gameId: string;
  onInviteSent: () => void;
}

export function InvitePlayerModal({ gameId, onInviteSent }: InvitePlayerModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  const { mutate: sendInvite, isPending } = useMutation({
    mutationFn: async () => {
      return await fetcher(`/api/gamemaster/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          email,
          displayName,
        }),
      });
    },
    onSuccess: () => {
      toast.success("Invite sent successfully.");
      onInviteSent();
      setOpen(false);
      setEmail("");
      setDisplayName("");
    },
    onError: () => {
      toast.error("Failed to send invite.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendInvite();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Send Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a New Invite</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Email</Label>
          <Input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="player@example.com"
            disabled={isPending}
          />
          <Label>Display Name</Label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Optional display name"
            disabled={isPending}
          />
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
