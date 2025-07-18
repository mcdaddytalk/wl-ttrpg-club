"use client"

import { 
  DaysOfWeek, 
//  DOW, 
  GAME_INTERVALS, 
//  GameInterval, 
  Location 
} from '@/lib/types/custom';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input';
import logger from '@/utils/logger';
import { useCreateGame } from '@/hooks/gamemaster/useGamemasterGames';
import { useForm } from 'react-hook-form';
import { CreateGameFormValues, CreateGameSchema } from '@/lib/validation/games';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import dayjs from 'dayjs';


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
  const { mutate: createGame, isPending } = useCreateGame();

  const form = useForm<CreateGameFormValues>({
    resolver: zodResolver(CreateGameSchema),
    defaultValues: {
      title: '',
      description: '',
      system: '',
      visibility: 'public',
      status: 'planning',
      max_seats: 5,
      starting_seats: 0,
      interval: 'weekly',
      day_of_week: 'sunday',
      first_game_date: dayjs().hour(12).minute(0).second(0).millisecond(0).toISOString(),
      location_id: ''
    }
  });

  const {
    formState: { errors },
  //  setValue,
    handleSubmit,
    watch,
  } = form;

  const onSubmit = handleSubmit((values) => {
    const firstGameDateIso = new Date(values.first_game_date).toISOString();

    logger.debug('Creating game', { ...values, first_game_date: firstGameDateIso });

    createGame(
      { 
        ...values,
        first_game_date: firstGameDateIso,
        next_game_date: firstGameDateIso,
        gamemaster_id 
      },
      {
        onSuccess: () => {
          toast.success('Game created!');
          onGameAdded();
          onClose();
        },
        onError: () => toast.error('Failed to create game')
      }
    );
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new game.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-2 w-full px-1 sm:px-2 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="A Game of Thrones"                    
                    type="text"
                    {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name of your game.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of your game, setting, characters, etc."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description of your game, setting, characters, etc.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <FormField
                  control={form.control}
                  name="system"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Game System" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DND5E">D&D 5e</SelectItem>
                          <SelectItem value="PF2E">Pathfinder 2e</SelectItem>
                          <SelectItem value="SWADE">Savage Worlds</SelectItem>
                        </SelectContent>
                      </Select>
                        <FormDescription>System used for this game (If system is not list, please contact Admin)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-6">
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select 
                        value={watch('visibility')} 
                        // onValueChange={(value) => setValue('visibility', value as 'public' | 'private')}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger  className="col-span-3">
                          <SelectValue placeholder="Select Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          {['public', 'private'].map((visOption) => (<SelectItem key={visOption} value={visOption}>
                              {visOption.charAt(0).toUpperCase() + visOption.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                        <FormDescription>Select how your game will be displayed (Public or Private)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval</FormLabel>
                      <Select 
                        value={watch('interval')} 
                        // </FormItem>onValueChange={(value) => setValue('interval', value as GameInterval)}>
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger  className="col-span-3">
                          <SelectValue placeholder="Select Interval" />
                        </SelectTrigger>
                        <SelectContent>
                          {GAME_INTERVALS.map((interval) => (
                            <SelectItem key={interval} value={interval}>
                              {interval.charAt(0).toUpperCase() + interval.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                        <FormDescription>How often will your game be played.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="day_of_week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Week</FormLabel>
                      <Select 
                        value={watch('day_of_week')} 
                        //onValueChange={(value) => setValue('day_of_week', value as DOW)}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger  className="col-span-3">
                          <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DaysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                        <FormDescription>Select day of the week the game will be played.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-6">
                <FormField
                  control={form.control}
                  name="first_game_date"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Datetime</FormLabel>
                    <FormControl>
                      <SmartDatetimeInput
                        value={new Date(field.value)}
                        onValueChange={(val) => {
                          field.onChange(val instanceof Date ? val.toISOString() : val);
                        }}
                        placeholder="e.g. Tomorrow morning 9am"
                      />
                    </FormControl>
                    <FormDescription>Select date and time of first game (used to determine next game date)</FormDescription>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <FormField
                  control={form.control}
                  name="max_seats"
                  render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Max Seats - {value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={20}
                        step={1}
                        defaultValue={[5]}
                        onValueChange={(vals) => {
                          onChange(vals[0]);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Set the max number of seats with slider.</FormDescription>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-6">
                <FormField
                  control={form.control}
                  name="starting_seats"
                  render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Starting Seats - {value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={20}
                        step={1}
                        defaultValue={[0]}
                        onValueChange={(vals) => {
                          onChange(vals[0]);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Set the number of players needed to start game.</FormDescription>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                    <Select 
                        value={watch('location_id')} 
                        // onValueChange={(e) => setValue('location_id', e)}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                  <FormDescription>Where will the game be played? (If location is not listed, please add location before adding game)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {errors  && <span className="text-red-500">{errors.root?.message}</span>}
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
