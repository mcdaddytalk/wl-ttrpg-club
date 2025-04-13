"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateGameSchema } from "@/lib/validation/games";
import { useCreateGame } from "@/hooks/gamemaster/useGamemasterGames";

type FormValues = z.infer<typeof CreateGameSchema>;

export default function GamemasterGameForm() {
  const router = useRouter();
  const { mutate: createGame, isPending } = useCreateGame();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateGameSchema),
    defaultValues: {
      title: "",
      description: "",
      system: "",
      visibility: "public",
      status: "planning",
      max_seats: 5,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createGame(values, {
      onSuccess: (data) => {
        toast.success("Game created!");
        router.push(`/gamemaster/games/${data.id}`);
      },
      onError: () => toast.error("Failed to create game"),
    });
  });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Create New Game</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input {...form.register("title")} placeholder="Game Title" />
          <Textarea {...form.register("description")} placeholder="Game Description" />
          <Input {...form.register("system")} placeholder="System (e.g., D&D 5e, Pathfinder)" />
          <Input
            type="number"
            {...form.register("max_seats", { valueAsNumber: true })}
            placeholder="Max Players"
          />
          <Input
            type="number"
            {...form.register("starting_seats", { valueAsNumber: true })}
            placeholder="Starting Players (optional)"
          />
          <Select
            value={form.watch("visibility")}
            onValueChange={(val) => form.setValue("visibility", val as "public" | "private")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.watch("status")}
            onValueChange={(val) =>
              form.setValue("status", val as "planning" | "active" | "paused" | "completed")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" disabled={isPending}>
            Create Game
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
