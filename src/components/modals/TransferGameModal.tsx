"use client"

import { useTransferGame } from "@/hooks/useTransferGame";
import { GMGameDO, MemberDO } from "@/lib/types/data-objects";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface TransferGameModalProps {
    isOpen: boolean;
    game: GMGameDO;
    gamemaster_id: string;
    gamemasters: MemberDO[];
    onConfirm: () => void;
    onClose: () => void;
}

export const TransferGameModal: React.FC<TransferGameModalProps> = ({ 
    isOpen, 
    game, 
    gamemaster_id, 
    gamemasters, 
    onConfirm, 
    onClose 
}) => {
    const { mutate: transferGame, isPending } = useTransferGame();
    
    const gamemaster = gamemasters.find((gm) => gm.id === gamemaster_id) || null;
    const availableGMs = gamemasters.filter((gm) => gm.id !== gamemaster_id);
    const [selectedGamemaster, setGamemaster] = useState<MemberDO | null>(gamemaster);

    const handleSubmit = async () => {
        if (!selectedGamemaster) return;
        transferGame(
            { 
                id: game.id,
                game_title: game.title,
                old_gm_id: gamemaster_id,
                old_gm_name: gamemaster?.displayName || gamemaster_id,
                new_gm_id: selectedGamemaster?.id 
            },
            {
                onSuccess: () => {
                    toast.success("Game Transfered")
                },
                onError: () => {
                    toast.error("Failed to transfer game")
                },
                onSettled: () => {
                    onConfirm();
                }
            }
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Game</DialogTitle>
                    <DialogDescription>
                    Transfer game to another gamemaster
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Gamemaster</Label>
                        <Select
                            value={selectedGamemaster?.id}
                            onValueChange={(value) => {
                                setGamemaster(gamemasters.find((gm) => gm.id === value) || null)
                            }}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={selectedGamemaster?.displayName} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableGMs.map((gm) => (
                                    <SelectItem key={gm.id} value={gm.id}>{gm.displayName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? <span className="mr-2">Transfering...</span> : <span className="mr-2">Transfer</span>}
                    </Button>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}