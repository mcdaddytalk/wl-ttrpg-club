"use client"

import { MemberDO, InvitedPlayer, GMGameSummaryDO } from "@/lib/types/custom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import UserAvatar from "../UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteFormSchema, InviteFormValues } from "@/lib/validation/invites";
import { FormSelect } from "@/components/ui/form-select";

interface GMInviteModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    gamemasterId: string;
    games: GMGameSummaryDO[];
    members: MemberDO[];
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

  export const GMInviteModal: React.FC<GMInviteModalProps> = ({ gamemasterId, games, members, isOpen, onConfirm, onCancel }) => {
    const form = useForm<InviteFormValues>({
      resolver: zodResolver(InviteFormSchema),
      mode: "onChange",
      defaultValues: {
        game_id: "",
        internal_invitees: [],
        external_invitees: [],
      },
    });
  
    const {
      register,
      control,
      setValue,
      handleSubmit,
      watch,
      formState: { errors },
    } = form;
  
    const externalInvitees = useFieldArray({ control, name: "external_invitees" });
    const inviteMutation = useMutation({
      mutationFn: sendGameInvite,
      onSuccess: () => {
        toast.success("Invite sent successfully!");
        form.reset();
        onConfirm();
      },
      onError: () => toast.error("Failed to send invite."),
    });
  
    const onSubmit = handleSubmit((data) => {
        if (!data.game_id) {
            toast.error("Please select a game.");
            return;
        }
        if ((data.internal_invitees?.length === 0) && (data.external_invitees?.length === 0)) {
            toast.error("Please select at least one internal or external invitee.");
            return;
        }
        const internal = members
            .filter((m) => (data.internal_invitees || []).includes(m.email))
            .map((m) => ({
                id: m.id,
                email: m.email,
                phone: m.phone,
                provider: "supabase",
                given_name: m.given_name || "",
                surname: m.surname || "",
                displayName: `${m.given_name} ${m.surname}`.trim(),
                expires_in_days: 7,
            }));
    
        const allInvitees = [
            ...internal, 
            ...(data.external_invitees || []).map((e) => ({
                ...e,
                displayName: `${e.given_name} ${e.surname}`.trim(),
                expires_in_days: parseInt(e.expires_in_days as string, 10) || 7,
        }))
    ];
  
      inviteMutation.mutate({
        gameId: data.game_id,
        invitees: allInvitees,
        gamemasterId,
      });
      onConfirm();
    });
  
    return (
      <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Player</DialogTitle>
            <DialogDescription>Invite a player to join your game.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Game Select */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label>Game</Label>
                <FormSelect
                    control={control}
                    className="col-span-3"
                    name="game_id"
                    options={games.map((g) => ({ value: g.id, label: g.title }))}
                    placeholder="Select a game"
                />
            </div>
  
            {/* Internal Invitees */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label>Members</Label>
                <div className="col-span-3 flex flex-col gap-2">
                    <Command>
                        <CommandInput className="w-full" placeholder="Search members..." />
                        <CommandList className="max-h-[200px] overflow-y-auto">
                            <CommandEmpty>No members found.</CommandEmpty>
                            <CommandGroup>
                                {members.map((m) => {
                                const selected = (watch("internal_invitees") || []).includes(m.email);
                                return (
                                    <CommandItem
                                    key={m.id}
                                    onSelect={() => {
                                        const updated = selected
                                        ? (watch("internal_invitees") || []).filter((email) => email !== m.email)
                                        : [...(watch("internal_invitees") || []), m.email];
                                        setValue("internal_invitees", updated);
                                    }}
                                    >
                                    <div className="flex items-center gap-2">
                                        <UserAvatar avatarUrl={m.avatar} fullName={m.displayName} size={8} />
                                        <span>{m.displayName}</span>
                                    </div>
                                    </CommandItem>
                                );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <div className="flex flex-row flex-wrap gap-2 mt-2 items-center">
                        {(watch("internal_invitees") || []).map((email) => {
                        const member = members.find((m) => m.email === email);
                        return member ? (
                            <Badge key={member.id} variant="secondary">{member.given_name} {member.surname}</Badge>
                        ) : null;
                        })}
                    </div>
                </div>
            </div>
  
            {/* External Invitees */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label>External Players</Label>
              <div className="col-span-3 flex flex-col gap-4">
                {externalInvitees.fields.map((field, index) => (
                  <div key={field.id} className="border p-3 rounded-md shadow-sm space-y-2">
                    <Input placeholder="Given Name" {...register(`external_invitees.${index}.given_name`)} />
                    {errors.external_invitees?.[index]?.given_name && (
                        <p className="text-red-500 text-sm">
                            {errors.external_invitees[index]?.given_name?.message}
                        </p>
                    )}
                    <Input placeholder="Surname" {...register(`external_invitees.${index}.surname`)} />
                    {errors.external_invitees?.[index]?.surname && (
                        <p className="text-red-500 text-sm">
                            {errors.external_invitees[index]?.surname?.message}
                        </p>
                    )}
                    <Input placeholder="Email" type="email" {...register(`external_invitees.${index}.email`)} />
                    {errors.external_invitees?.[index]?.email && (
                        <p className="text-red-500 text-sm">
                            {errors.external_invitees[index]?.email?.message}
                        </p>
                    )}
                    <Input placeholder="Phone (optional)" type="tel" {...register(`external_invitees.${index}.phone`)} />
                    <Select onValueChange={(val) => setValue(`external_invitees.${index}.expires_in_days`, val)}>
                      <SelectTrigger><SelectValue placeholder="Expires in..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.external_invitees?.[index]?.expires_in_days && (
                        <p className="text-red-500 text-sm">
                            {errors.external_invitees[index]?.expires_in_days?.message}
                        </p>
                    )}
                    <Button variant="destructive" onClick={() => externalInvitees.remove(index)}>Remove</Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => externalInvitees.append({ given_name: "", surname: "", email: "", expires_in_days: "7" })}>
                  + Add External Invitee
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={onSubmit} disabled={inviteMutation.isPending || !form.formState.isValid}>
                Send Invites
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };