"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { InvitedPlayer, MemberDO } from "@/lib/types/data-objects";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "../ui/badge";
import UserAvatar from "../UserAvatar";

interface InvitePlayerProps {
    gameId: string;
    gamemasterId: string;
    members: MemberDO[];
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
async function sendGameInvite({ gameId, invitees, gamemasterId }: { gameId: string; invitees: InvitedPlayer[], gamemasterId: string }) {
    const res = await fetch(`/api/games/${gameId}/invite`, {
      method: "POST",
      body: JSON.stringify({ invitees, gamemasterId }),
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) {
      throw new Error("Failed to send invites.");
    }
  

    return res.json();
  }

export const GameInviteModal: React.FC<InvitePlayerProps> = ({ gameId, gamemasterId, members, isOpen, onConfirm, onCancel }) => {
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [externalInvitees, setExternalInvitees] = useState<InvitedPlayer[]>([]);

    // Adds a new external invitee field
    const addExternalInvitee = () => {
        setExternalInvitees([...externalInvitees, { given_name: "", surname: "", displayName: "", email: "", phone: "" }]);
    };

    // Updates an external invitee's field
    type EditableInviteeField = 'given_name' | 'surname' | 'email' | 'phone';

    const updateExternalInvitee = (
        index: number,
        key: EditableInviteeField,
        value: string
    ) => {
        const updatedInvitees = [...externalInvitees];
        updatedInvitees[index][key] = value;
        updatedInvitees[index].displayName = `${updatedInvitees[index].given_name} ${updatedInvitees[index].surname}`.trim();
        setExternalInvitees(updatedInvitees);
    };

    // Removes an external invitee
    const removeExternalInvitee = (index: number) => {
        setExternalInvitees(externalInvitees.filter((_, i) => i !== index));
    };

    const inviteMutation = useMutation({
        mutationFn: sendGameInvite,
        onSuccess: () => {
            toast.success("Invite sent successfully!");
            setSelectedMembers([]);
            setExternalInvitees([]);
        },
        onError: () => toast.error("Failed to send invite."),
      });

      // Submits all invites (merging internal & external invitees)
  const handleInvite = () => {
    if (selectedMembers.length === 0 && externalInvitees.length === 0) {
      return toast.error("Please select at least one member or enter external invitee details.");
    }

    // Convert selected members to MemberDO format
    const internalInvitees: InvitedPlayer[] = members
      ?.filter(member => selectedMembers.includes(member.email))
      .map(member => ({
        id: member.id,
        provider: "supabase",
        given_name: member.given_name || "",
        surname: member.surname || "",
        displayName: `${member.given_name} ${member.surname}`.trim(),
        email: member.email || "",
        phone: member.phone || "",
      })) || [];

    // Merge internal & external invitees
    const allInvitees = [...internalInvitees, ...externalInvitees];

    inviteMutation.mutate({ gameId, invitees: allInvitees, gamemasterId });
        onConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Player</DialogTitle>
                    <DialogDescription>
                        Invite a player to join your game.
                    </DialogDescription>
                </DialogHeader>
                {/* Multi-Select for Internal Members */}
                <div>
                    <Label className="text-sm font-medium">Select Members</Label>
                    <Command>
                        <CommandInput placeholder="Search members..." />
                        <CommandList>
                            <CommandEmpty>No members found.</CommandEmpty>
                            <CommandGroup>
                                {members.map((member) => (
                                    <CommandItem
                                        key={member.id}
                                        onSelect={() =>
                                            setSelectedMembers((prevSelected) =>
                                                prevSelected.includes(member.email)
                                                    ? prevSelected.filter((id) => id !== member.email)
                                                    : [...prevSelected, member.email]
                                            )
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <UserAvatar
                                                avatarUrl={member.avatar}
                                                fullName={member.displayName}
                                                size={8}
                                            />
                                            <span>{member.displayName}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMembers.map((email) => {
                            const member = members.find(m => m.email === email);
                            return member ? (
                                <Badge key={member.id} variant="secondary">
                                    {member.given_name} {member.surname}
                                </Badge>
                            ) : null;
                        })}
                    </div>
                </div>

                {/* External Invitee Inputs */}
                <div className="mt-4">
                    <Label className="text-sm font-medium">Invite External Players</Label>
                    {externalInvitees.map((invitee, index) => (
                        <div key={index} className="border p-3 rounded-md shadow-sm mt-3">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={invitee.given_name}
                                    onChange={(e) => updateExternalInvitee(index, "given_name", e.target.value)}
                                    placeholder="Given Name"
                                />
                                <Input
                                    type="text"
                                    value={invitee.surname}
                                    onChange={(e) => updateExternalInvitee(index, "surname", e.target.value)}
                                    placeholder="Surname"
                                />
                            </div>
                            <Input
                                type="email"
                                className="mt-2"
                                value={invitee.email}
                                onChange={(e) => updateExternalInvitee(index, "email", e.target.value)}
                                placeholder="Email"
                            />
                            <Input
                                type="tel"
                                className="mt-2"
                                value={invitee.phone}
                                onChange={(e) => updateExternalInvitee(index, "phone", e.target.value)}
                                placeholder="Phone (optional)"
                            />
                            <Button variant="destructive" className="mt-2" onClick={() => removeExternalInvitee(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button className="mt-2" variant="outline" onClick={addExternalInvitee}>+ Add External Invitee</Button>
                </div>
                <DialogFooter>
                    <Button onClick={handleInvite} disabled={inviteMutation.isPending}>Send Invites</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};