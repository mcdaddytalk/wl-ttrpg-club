"use client";

import { Player } from "@/lib/types/custom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUpdateRegistrantStatus } from "@/hooks/gamemaster/useGamemasterPlayers";
import { useMemo, useState } from "react";

interface RegisteredPlayersManagerProps {
  gameId: string;
  registrants: Player[];
  onRegistrantUpdated: () => void;
}

type RemoveDecision = "rejected" | "banned";

export default function RegisteredPlayersManager({ gameId, registrants, onRegistrantUpdated }: RegisteredPlayersManagerProps) {
  const { mutate: updateStatus, isPending } = useUpdateRegistrantStatus(gameId);

  // UI: show/hide rejected/banned
  const [showHidden, setShowHidden] = useState(false);

  // Modal state
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Player | null>(null);
  const [decision, setDecision] = useState<RemoveDecision>("rejected");
  const [reason, setReason] = useState("");

  // Sort so rejected/banned sink to the bottom
  const sorted = useMemo(() => {
    const weight: Record<string, number> = {
      pending: 0,
      approved: 1,
      rejected: 2,
      banned: 3,
    };
    return [...registrants].sort((a, b) => {
      const wa = weight[a.status] ?? 99;
      const wb = weight[b.status] ?? 99;
      if (wa !== wb) return wa - wb;
      // stable-ish secondary: by name
      const an = `${a.given_name ?? ""} ${a.surname ?? ""}`.trim().toLowerCase();
      const bn = `${b.given_name ?? ""} ${b.surname ?? ""}`.trim().toLowerCase();
      return an.localeCompare(bn);
    });
  }, [registrants]);

  // Optional filter to hide rejected/banned
  const visibleRows = useMemo(() => {
    if (showHidden) return sorted;
    return sorted.filter((p) => p.status !== "rejected" && p.status !== "banned");
  }, [sorted, showHidden]);

  const handleApprove = (player: Player) => {
    updateStatus(
      { member_id: player.id, status: "approved", note: "" },
      {
        onSuccess: () => {
          toast.success("Player approved.");
          onRegistrantUpdated();
        },
        onError: () => toast.error("Failed to approve player."),
      }
    );
  };

  const openRemoveModal = (player: Player) => {
    setRemoveTarget(player);
    setDecision("rejected");
    setReason("");
    setRemoveOpen(true);
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    updateStatus(
      { member_id: removeTarget.id, status: decision, note: reason.trim() },
      {
        onSuccess: () => {
          toast.success(decision === "banned" ? "Player banned." : "Player rejected.");
          setRemoveOpen(false);
          setRemoveTarget(null);
          onRegistrantUpdated();
        },
        onError: () => toast.error("Failed to update player."),
      }
    );
  };

  const handleReinstate = (player: Player) => {
    updateStatus(
      { member_id: player.id, status: "pending", note: "" }, // clear note
      {
        onSuccess: () => {
          toast.success("Player reinstated to pending.");
          onRegistrantUpdated();
        },
        onError: () => toast.error("Failed to reinstate player."),
      }
    );
  };

  if (registrants.length === 0) {
    return <div>No players registered yet.</div>;
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Label htmlFor="toggle-hidden" className="text-sm">Show rejected/banned</Label>
          <Switch
            id="toggle-hidden"
            checked={showHidden}
            onCheckedChange={(v) => setShowHidden(v)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2 w-[40%]">Status Note</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((player) => {
              const isArchived = player.status === "rejected" || player.status === "banned";
              return (
                <tr
                  key={player.id}
                  className={cn("border-t", isArchived && "opacity-70")}
                >
                  <td className="p-2">{player.given_name} {player.surname}</td>
                  <td className="p-2">{player.email}</td>
                  <td className="p-2 capitalize">{player.status}</td>
                  <td className="p-2">
                    {player.statusNote ? (
                      <span className="line-clamp-3">{player.statusNote}</span>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="p-2 space-x-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
                    {player.status === "pending" && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={isPending}
                        onClick={() => handleApprove(player)}
                      >
                        Approve
                      </Button>
                    )}
                    {(player.status === "approved" || player.status === "pending") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => openRemoveModal(player)}
                      >
                        Remove
                      </Button>
                    )}
                    {(player.status === "rejected" || player.status === "banned") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleReinstate(player)}
                      >
                        Reinstate
                      </Button>
                    )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Remove / Reject / Ban Modal */}
      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Player Status</DialogTitle>
            <DialogDescription>
              Choose whether to reject or ban this player and provide an optional reason.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Action</Label>
              <RadioGroup
                value={decision}
                onValueChange={(v) => setDecision(v as RemoveDecision)}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem id="reject" value="rejected" />
                  <Label htmlFor="reject">Reject</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem id="ban" value="banned" />
                  <Label htmlFor="ban">Ban</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="reason" className="mb-2 block">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Add a short note explaining why…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setRemoveOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={confirmRemove}
            >
              {decision === "banned" ? "Ban Player" : "Reject Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
