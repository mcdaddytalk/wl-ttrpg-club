import React, { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateNextGameDate, daysOfWeek, intervals, gameStatuses } from '@/utils/helpers';
import { toast } from "sonner";
import { useUpdateGame } from "@/hooks/useUpdateGame";
import { DOW, GameInterval, GameStatus, GMGameData } from "@/lib/types/custom";

interface EditGameModalProps {
    isOpen: boolean,
    game: GMGameData,
    onConfirm: () => void,
    onCancel: () => void,
    gamemaster_id: string
}

export const EditGameModal: React.FC<EditGameModalProps> = ({ isOpen, game, onConfirm, onCancel, gamemaster_id }) => {
    // Game details
    const [gameTitle, setGameTitle] = useState(game.title);
    const [gameDescription, setGameDescription] = useState(game.description);
    const [gameSystem, setGameSystem] = useState(game.system);
    const [gameMaxSeats, setGameMaxSeats] = useState(game.maxSeats);
    
    // Game schedule details
    const [gameDate, setGameDate] = useState(game.scheduled_next);
    const [gameInterval, setGameInterval] = useState(game.interval);
    const [gameDay, setGameDay] = useState(game.dow);
    const [gameStatus, setGameStatus] = useState(game.status);
    const [gameLocation, setGameLocation] = useState(game.location);

    const { mutate: editGame, isPending } = useUpdateGame();

    const handleEditSubmit = async () => {
        const nextGameDate = calculateNextGameDate(gameDay, gameInterval, gameDate);
        if (nextGameDate) {
            setGameDate(new Date(nextGameDate));
            const editedGame = {
                // ...game,
                id: game.id,
                title: gameTitle,
                description: gameDescription,
                system: gameSystem,
                maxSeats: gameMaxSeats,
                status: gameStatus,
                location: gameLocation,
                nextGameDate: gameDate,
                interval: gameInterval,
                dayOfWeek: gameDay,
                gm_id: gamemaster_id
            }
            editGame(editedGame,
                {
                    onSuccess: () => {
                        toast.success("Game updated successfully");
                    },
                    onError: () => {
                        toast.error("Failed to update game");
                    },
                    onSettled: () => {
                        onConfirm();
                    }
                }
            );
        } else {
            toast.error("Invalid game date");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Game</DialogTitle>
                    <DialogDescription>
                        Edit game details and update next game date
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={gameDescription} onChange={(e) => setGameDescription(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="system" className="text-right">System</Label>
                        <Input id="system" value={gameSystem} onChange={(e) => setGameSystem(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxSeats" className="text-right">Max Seats</Label>
                        <Input id="maxSeats" value={gameMaxSeats} onChange={(e) => setGameMaxSeats(e.target.value as unknown as number)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="interval" className="text-right">Interval</Label>
                        <Select 
                            value={gameInterval} 
                            onValueChange={(e) => setGameInterval(e as GameInterval)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select an interval" />
                            </SelectTrigger>
                            <SelectContent>
                                {intervals.map((interval) => (
                                    <SelectItem key={interval} value={interval}>
                                        {interval.charAt(0).toUpperCase() + interval.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="day" className="text-right">Day</Label>
                        <Select 
                            value={gameDay} 
                            onValueChange={(e) => setGameDay(e as DOW)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                            <SelectContent>
                                {daysOfWeek.map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>   
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select 
                            value={gameStatus} 
                            onValueChange={(e) => setGameStatus(e as GameStatus)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {gameStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">Location</Label>
                        <Input id="location" value={gameLocation} onChange={(e) => setGameLocation(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleEditSubmit} disabled={isPending}>
                        {isPending ? <span className="mr-2">Saving...</span> : <span className="mr-2">Save</span>}
                    </Button>
                    <Button variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}