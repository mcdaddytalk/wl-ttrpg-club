"use client"

import { useState } from "react";

// import { useUpdateGame } from "@/hooks/useUpdateGame";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import DatetimePicker from '@/components/ui/datetime-picker'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { GMGameDO } from "@/lib/types/data-objects";
import { useUpdateGameDetails } from "@/hooks/gamemaster/useGamemasterGames";



interface SetGameTimeModalProps {
    isOpen: boolean;
    game: GMGameDO;
    gamemaster_id: string;
    onConfirm: () => void;
    onClose: () => void;
}

export const SetGameTimeModal: React.FC<SetGameTimeModalProps> = ({ 
    isOpen,
    game,
    gamemaster_id,
    onConfirm,
    onClose
}) => {
    const { mutate: setGameTime, isPending } = useUpdateGameDetails(game.id);

    const [nextGameDate, setNextGameDate] = useState<string | undefined>(
        game.scheduled_next ?? undefined
      );

    const handleSubmit = async () => {
        setGameTime(
            { 
                id: game.id, 
                nextGameDate,
                gm_id: gamemaster_id },
            {
                onSuccess: () => {
                    toast.success("Game Date Updated")
                },
                onError: () => {
                    toast.error("Failed to update game date")
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
                    <DialogTitle>Set Next Game Date</DialogTitle>
                    <DialogDescription>
                        Set the next game date for this game.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                            Next Game Date
                        </label>
                        <DatetimePicker
                            selected={typeof nextGameDate === 'string' ? new Date(nextGameDate) : undefined}
                            setDate={(date) => setNextGameDate(date?.toISOString())}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? <span className="mr-2">Updating...</span> : <span className="mr-2">Update</span>}
                    </Button>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

}