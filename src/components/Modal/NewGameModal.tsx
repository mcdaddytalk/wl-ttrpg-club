import { DOW, GameInterval, Location } from '@/lib/types/custom';
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { calculateNextGameDate, daysOfWeek, intervals } from '@/utils/helpers';

interface NewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGameAdded: () => void;
    gamemaster_id: string;
    locations: Location[];
}

export default function NewGameModal({
    isOpen,
    onClose,
    onGameAdded,
    gamemaster_id,
    locations
}:NewModalProps): React.ReactElement {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [system, setSystem] = useState('');
  const [interval, setInterval] = useState<GameInterval>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState<DOW>('sunday');
  const [maxSeats, setMaxSeats] = useState<number | ''>('');
  const [gameLocationId, setGameLocationId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
        setError(null);

        if (!title || !system || !interval || !dayOfWeek || !maxSeats || !gameLocationId) {
            setError('All fields are required.');
            return;
        }

        const nextGameDate = calculateNextGameDate(dayOfWeek, interval);

        const response = await fetch(`/api/gamemaster/${gamemaster_id}/games`,
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    title,
                    description,
                    system,
                    interval,
                    dayOfWeek,
                    nextGameDate,
                    maxSeats,
                    gamemaster_id,
                    location_id: gameLocationId
                }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to add the game. Please try again.');
        }
        onGameAdded();
        onClose();
    } catch (err) {
      setError('Failed to add the game. Please try again.');
      console.error(err);      
    }
  };

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new game.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="block font-medium">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="block font-medium">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="block font-medium">System</Label>
            <Input value={system} onChange={(e) => setSystem(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="block font-medium">Interval</Label>
            <Select value={interval} onValueChange={(value) => setInterval(value as 'weekly' | 'biweekly' | 'monthly')}>
              <SelectTrigger  className="col-span-3">
                <SelectValue placeholder="Select Interval" />
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
            <Label className="block font-medium">Starting Day of the Week</Label>
            <Select value={dayOfWeek} onValueChange={(value) => setDayOfWeek(value as DOW)}>
              <SelectTrigger  className="col-span-3">
                <SelectValue placeholder="Select Day" />
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
            <Label className="block font-medium">Max Seats</Label>
            <Input type="number" value={maxSeats} onChange={(e) => setMaxSeats(Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Select 
                  value={gameLocationId} 
                  onValueChange={(e) => setGameLocationId(e as string)}
              >
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                      {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                              {location.name}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
