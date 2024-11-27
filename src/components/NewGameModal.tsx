import { DOW, GameInterval } from '@/lib/types/custom';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from './ui/textarea';

const daysOfWeek: DOW[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const intervals: GameInterval[] = ['weekly', 'biweekly', 'monthly', 'yearly', 'custom'];

interface NewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGameAdded: () => void;
    gamemaster_id: string
}

export default function NewGameModal({
    isOpen,
    onClose,
    onGameAdded,
    gamemaster_id
}:NewModalProps): React.ReactElement {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [system, setSystem] = useState('');
  const [interval, setInterval] = useState<GameInterval>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState<DOW>('sunday');
  const [maxSeats, setMaxSeats] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
        setError(null);

        if (!title || !system || !interval || !dayOfWeek || !maxSeats) {
            setError('All fields are required.');
            return;
        }

        const nextGameDate = calculateNextGameDate(dayOfWeek, interval);

        const response = await fetch('/api/games/add-new', { 
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
                    gamemaster_id
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

  const calculateNextGameDate = (dayOfWeek: DOW, interval: GameInterval) => {
    const today = new Date();
    const targetDay = daysOfWeek.indexOf(dayOfWeek);
    const currentDay = today.getDay();
    const daysUntilNext = (targetDay - currentDay + 7) % 7 || 7; // Ensure it's at least the next occurrence
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);

    if (interval === 'weekly') {
      return nextDate.toISOString();
    }
    if (interval === 'biweekly') {
      nextDate.setDate(nextDate.getDate() + 14);
      return nextDate.toISOString();
    }
    if (interval === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate.toISOString();
    }

    return nextDate.toISOString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <Label className="block font-medium">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label className="block font-medium">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label className="block font-medium">System</Label>
            <Input value={system} onChange={(e) => setSystem(e.target.value)} />
          </div>
          <div>
            <Label className="block font-medium">Interval</Label>
            <Select value={interval} onValueChange={(value) => setInterval(value as 'weekly' | 'biweekly' | 'monthly')}>
              <SelectTrigger>
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
          <div>
            <Label className="block font-medium">Starting Day of the Week</Label>
            <Select value={dayOfWeek} onValueChange={(value) => setDayOfWeek(value as DOW)}>
              <SelectTrigger>
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
          <div>
            <Label className="block font-medium">Max Seats</Label>
            <Input type="number" value={maxSeats} onChange={(e) => setMaxSeats(Number(e.target.value))} />
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
