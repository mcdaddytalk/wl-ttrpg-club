"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GMGameDO, GMLocationDO } from "@/lib/types/data-objects";
import { useUpdateGameDetails } from "@/hooks/gamemaster/useGamemasterGames";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DaysOfWeek, GAME_INTERVALS, GAME_SCHED_STATUS, GAME_STATUS, GAME_VISIBILITY } from "@/lib/types/custom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDeleteGameCover, useUploadGameCover } from "@/hooks/gamemaster/useGamemasterGameCover";
import { ImageCropUploader } from "@/components/ImageCropUploader";
import { toSentenceCase } from "@/utils/helpers";
import { InlineDatetimePicker } from "@/components/InlineDatetimePicker";

const gameDetailsSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  max_seats: z.coerce.number().min(1).max(99),
  starting_seats: z.coerce.number().min(1).max(99),
  // tags: z.array(z.string()).optional(),
  visibility: z.enum(GAME_VISIBILITY).default("public"),
  cover_image: z
  .string()
  .optional()
  .refine((val) => !val || val === 'default' || /^https?:\/\//.test(val), {
    message: 'Must be a valid URL or "default"',
  }),
  content_warnings: z.string().optional(),
  system: z.string().min(1),
  status: z.enum(GAME_STATUS).default("planning"),
  // session_duration: z.coerce.number().min(0).max(480).optional(),
  interval: z.enum(GAME_INTERVALS),
  day_of_week: z.enum(DaysOfWeek),
  schedule_status: z.enum(GAME_SCHED_STATUS).default("draft"),
  next_game_date: z.string().optional(),
  location_id: z.string().optional(),
  // notes_for_players: z.string().optional(),
});

type GameDetailsFormValues = z.infer<typeof gameDetailsSchema>;

interface GameDetailsEditorProps {
  game: GMGameDO;
  locations: GMLocationDO[];
}

export default function GameDetailsEditor({ game, locations }: GameDetailsEditorProps) {
  const form = useForm<GameDetailsFormValues>({
    resolver: zodResolver(gameDetailsSchema),
    defaultValues: {
      title: game.title,
      description: game.description ?? '',
      max_seats: game.maxSeats ?? 6,
      starting_seats: game.startingSeats ?? 4,
      visibility: game.visibility ?? 'public',
      cover_image: game.coverImage ?? '',
      content_warnings: game.content_warnings ?? '',
      system: game.system ?? '',
      status: game.status ?? 'planning',
      interval: game.interval ?? 'weekly',
      day_of_week: game.dow ?? 'monday',
      schedule_status: game.schedStatus ?? 'draft',
      next_game_date: game.scheduled_next ?? '',
      location_id: game.location_id ?? '',
    },
  });

  const { mutate: updateGame, isPending } = useUpdateGameDetails(game.id);
  const { mutateAsync: uploadCoverRaw } = useUploadGameCover(game.id);
  const { mutateAsync: deleteCoverRaw } = useDeleteGameCover(game.id);

  const onSubmit = (values: GameDetailsFormValues) => {
    updateGame(values, {
      onSuccess: () => toast.success('Game details updated.'),
      onError: () => toast.error('Failed to update game details.'),
    });
  };

  const uploadCover = async (file: File): Promise<string> => {
    return await uploadCoverRaw(file); // file is passed as-is
  };

  const deleteCover = async (): Promise<void> => {
    await deleteCoverRaw();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold">Game Details</h2>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input {...field} disabled={isPending} /></FormControl>
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
              <FormControl><Textarea {...field} rows={4} disabled={isPending} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Seats</FormLabel>
                <FormControl><Input type="number" {...field} disabled={isPending} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="starting_seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Seats</FormLabel>
                <FormControl><Input type="number" {...field} disabled={isPending} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isPending}>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GAME_VISIBILITY.map((v) => (
                    <SelectItem key={v} value={v}>{toSentenceCase(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageCropUploader
                  value={field.value ?? 'default'}
                  onChange={field.onChange}
                  onUpload={uploadCover}
                  onDelete={deleteCover}
                  aspectRatio={16 / 9}
                  disabled={isPending}
                  placeholderUrl="/images/defaults/default_game.webp"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content_warnings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Warnings</FormLabel>
              <FormControl><Textarea {...field} rows={3} disabled={isPending} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="system"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game System</FormLabel>
                <FormControl><Input {...field} disabled={isPending} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue placeholder={locations.find((l) => l.id === field.value)?.name ?? "Select a location"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isPending}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GAME_STATUS.map((s) => (
                      <SelectItem key={s} value={s}>{toSentenceCase(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isPending}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GAME_SCHED_STATUS.map((s) => (
                      <SelectItem key={s} value={s}>{toSentenceCase(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="next_game_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Game Date & Time</FormLabel>
                <FormControl>
                  <InlineDatetimePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Interval</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isPending}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GAME_INTERVALS.map((i) => (
                      <SelectItem key={i} value={i}>{toSentenceCase(i)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="day_of_week"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day of the Week</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isPending}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DaysOfWeek.map((d) => (
                      <SelectItem key={d} value={d}>{toSentenceCase(d)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
