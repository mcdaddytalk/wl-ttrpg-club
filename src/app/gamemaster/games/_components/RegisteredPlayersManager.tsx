"use client";

import { Player } from "@/lib/types/custom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRemovePlayer } from "@/hooks/gamemaster/useGamemasterPlayers";

interface RegisteredPlayersManagerProps {
  gameId: string;
  registrants: Player[];
  onRegistrantUpdated: () => void;
}

export default function RegisteredPlayersManager({ gameId, registrants, onRegistrantUpdated }: RegisteredPlayersManagerProps) {
  const { mutate: removeRegistrant } = useRemovePlayer(gameId);

  const handleRemove = (playerId: string) => {
    removeRegistrant(
      { member_id: playerId, status: "rejected", note: "" },
      {
        onSuccess: () => {
          toast.success("Player rejected from game.");
          onRegistrantUpdated();
        },
        onError: () => toast.error("Failed to reject player."),
      }
    );
  };

  if (registrants.length === 0) {
    return <div>No players registered yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrants.map((player) => (
            <tr key={player.id} className="border-t">
              <td className="p-2">{player.given_name} {player.surname}</td>
              <td className="p-2">{player.email}</td>
              <td className="p-2">{player.status}</td>
              <td className="p-2 space-x-2">
                <Button size="sm" variant="destructive" onClick={() => handleRemove(player.id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
