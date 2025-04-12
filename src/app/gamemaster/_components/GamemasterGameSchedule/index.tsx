"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GMGameScheduleSchema } from "@/lib/validation/gameSchedules";
import { useGameSchedule, useUpdateGameSchedule } from "@/hooks/gamemaster/useGamemasterGameSchedules";
import { DaysOfWeek, DOW, GAME_INTERVALS, GAME_SCHED_STATUS, GameInterval, GameSchedStatus } from "@/lib/types/custom";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useGamemasterLocations } from "@/hooks/gamemaster/useGamemasterLocations";
import { AddLocationModal } from "@/components/Modal/AddLocationModal";
import useSession from "@/utils/supabase/use-session";

type FormValues = z.infer<typeof GMGameScheduleSchema>;

const defaultSchedule: FormValues = {
  interval: "weekly",
  status: "draft",
  first_game_date: "",
  last_game_date: null,
  next_game_date: "",
  day_of_week: "monday",
  location_id: "",
};

export default function GamemasterGameSchedule({ gameId }: { gameId: string }) {
  const session = useSession();
  const user = session?.user;
  
  const { data: schedule, isLoading } = useGameSchedule(gameId);
  const { locations = [], refetch: refetchLocations } = useGamemasterLocations({ onlyActive: true });
  const { mutate: updateSchedule, isPending } = useUpdateGameSchedule(gameId);

  const [isAddLocationModalOpen, setAddLocationModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(GMGameScheduleSchema),
    defaultValues: schedule ?? defaultSchedule,
  });

  const { watch, register, formState: { errors }, setValue } = form;

  useEffect(() => {
    if (schedule) {
      form.reset(schedule);
    }
  }, [schedule, form]);

  const handleConfirmAddLocation = (newLocation?: { id: string }) => {
    toast.success("Location added!");
    setAddLocationModalOpen(false);
    refetchLocations(); // 🔄 Refresh the list
    if (newLocation?.id) {
      setValue("location_id", newLocation.id);
    }
  };

  const onSubmit = form.handleSubmit((values) => {
    updateSchedule(values, {
      onSuccess: () => toast.success("Schedule updated!"),
      onError: () => toast.error("Failed to update schedule"),
    });
  });

  if (!user) return <p className="text-center">Please log in to manage locations.</p>;
  if (isLoading) return <p>Loading schedule...</p>;

  const uniqueGamemasters = locations
  .flatMap(loc => loc.authorized_gamemasters)
  .filter((gm, index, self) =>
    index === self.findIndex((t) => t.id === gm.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Select value={watch("interval")} onValueChange={(v) => setValue("interval", v as GameInterval)}>
            <SelectTrigger><SelectValue placeholder="Select interval" /></SelectTrigger>
            <SelectContent>
              {GAME_INTERVALS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={watch("status")} onValueChange={(v) => setValue("status", v as GameSchedStatus)}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {GAME_SCHED_STATUS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="datetime-local"
            {...register("first_game_date")}
          />

          <Input
            type="datetime-local"
            {...register("next_game_date")}
          />

          <Input
            type="datetime-local"
            {...register("last_game_date")}
          />

          <Select
            value={watch("day_of_week")}
            onValueChange={(v) => setValue("day_of_week", v as DOW)}
          >
            <SelectTrigger><SelectValue placeholder="Day of Week" /></SelectTrigger>
            <SelectContent>
              {DaysOfWeek.map((day) => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid gap-2">
            <Label>Location</Label>
            <div className="flex gap-2 items-center">
              <Select
                value={form.watch("location_id")}
                onValueChange={(val) => form.setValue("location_id", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.length === 0 ? (
                    <SelectItem value="" disabled>No locations available</SelectItem>
                  ) : (
                    locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name} ({loc.type})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddLocationModalOpen(true)}>
                +
              </Button>
            </div>
            {errors.location_id && (
              <p className="text-red-500 text-sm">{errors.location_id.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending}>Save Schedule</Button>
        </form>
      </CardContent>
      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onCancel={() => setAddLocationModalOpen(false)}
        onConfirm={handleConfirmAddLocation}
        userId={user.id}
        scope="gm"
        gamemasters={uniqueGamemasters}
      />
    </Card>
  );
}
