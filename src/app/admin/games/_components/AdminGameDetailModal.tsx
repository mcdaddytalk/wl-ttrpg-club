"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GMGameDataDO } from "@/lib/types/data-objects";
import { useAdminGameDetails } from "@/hooks/admin/useAdminInvites";

interface AdminGameDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GMGameDataDO | null;
}

export function AdminGameDetailsModal({ isOpen, onClose, game }: AdminGameDetailsModalProps) {
  const { invites, players, isLoading, isError } = useAdminGameDetails(game?.id);

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Game Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div><strong>Status:</strong> {game.status}</div>
              <div><strong>Created:</strong> {new Date(game.created_at).toLocaleDateString()}</div>
              <div><strong>Archived:</strong> {game.archived ? "Yes" : "No"}</div>
              <div><strong>Gamemaster:</strong> {game.gm_name || "Unassigned"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invited Players</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading invites...</div>
              ) : isError ? (
                <div className="text-red-500">Failed to load invites.</div>
              ) : invites.length === 0 ? (
                <div>No invites found.</div>
              ) : (
                <div className="max-h-60 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invites.map((invite) => (
                        <tr key={invite.id}>
                          <td className="p-2">{invite.display_name}</td>
                          <td className="p-2">{invite.email}</td>
                          <td className="p-2">{invite.accepted ? "Accepted" : "Pending"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Players</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading registrations...</div>
              ) : isError ? (
                <div className="text-red-500">Failed to load registrations.</div>
              ) : players.length === 0 ? (
                <div>No players registered.</div>
              ) : (
                <div className="max-h-60 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player) => (
                        <tr key={player.id}>
                          <td className="p-2">{player.given_name} {player.surname}</td>
                          <td className="p-2">{player.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
