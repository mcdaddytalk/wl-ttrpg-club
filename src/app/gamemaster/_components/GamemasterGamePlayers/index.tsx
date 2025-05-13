"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useGamePlayers, useRemovePlayer } from "@/hooks/gamemaster/useGamemasterPlayers";
import { GMGamePlayerDO } from "@/lib/types/data-objects";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";

interface RemovalInfo {
    member_id: string;
    status: "rejected" | "banned";
    note: string;
}

export default function GamemasterGamePlayers({ gameId }: { gameId: string }) {
    const { data = [], isLoading } = useGamePlayers(gameId);
    const { mutate: removePlayer } = useRemovePlayer(gameId);
    const [removalInfo, setRemovalInfo] = useState<RemovalInfo | null>(null);

    return (
        <Card>
        <CardHeader>
            <CardTitle>Registered Players</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <p>Loading players...</p>
                ) : data.length === 0 ? (
                <p>No players registered yet.</p>
                ) : (
                <ul className="space-y-4">
                    {data.map((player: GMGamePlayerDO) => (
                    <li key={player.member_id} className="border p-4 rounded-md">
                        <div className="font-semibold">
                        {player.profiles?.given_name} {player.profiles?.surname}
                        </div>
                        <div className="text-sm text-muted-foreground">{player.email}</div>
                        <div className="text-xs">
                        Registered: {format(new Date(player.registered_at), "PPPp")}
                        </div>
                        <Badge variant="outline" className="mt-1">{player.status}</Badge>
                        {player.status_note && (
                        <div className="text-sm text-muted-foreground italic mt-1">
                            Note: {player.status_note}
                        </div>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                                setRemovalInfo({
                                  member_id: player.member_id,
                                  status: "rejected",
                                  note: "",
                                })
                              }
                        >
                            Remove
                        </Button>
                    </li>
                    ))}
                </ul>
                )}
                <Dialog open={!!removalInfo} onOpenChange={() => setRemovalInfo(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Remove Player</DialogTitle>
                        </DialogHeader>

                        <Label>Status</Label>
                        <Select value={removalInfo?.status} onValueChange={(val) =>
                        setRemovalInfo((info) => info ? { ...info, status: val as "rejected" | "banned" } : null)
                        }>
                        <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                        </Select>

                        <Label>Note</Label>
                        <Textarea
                        placeholder="Optional reason for removal..."
                        value={removalInfo?.note ?? ""}
                        onChange={(e) =>
                            setRemovalInfo((info) => info ? { ...info, note: e.target.value } : null)
                        }
                        />

                        <Button
                        disabled={!removalInfo?.status}
                        onClick={() => {
                            removePlayer({ member_id: removalInfo!.member_id, status: removalInfo!.status, note: removalInfo!.note });
                            setRemovalInfo(null);
                        }}
                        >
                        Confirm Remove
                        </Button>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
