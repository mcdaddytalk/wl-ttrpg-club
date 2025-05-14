"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GMGameDO } from "@/lib/types/data-objects";
import { useUpdateGameDetails } from "@/hooks/gamemaster/useGamemasterGames";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface GameDetailsEditorProps {
  game: GMGameDO;
}

export default function GameDetailsEditor({ game }: GameDetailsEditorProps) {
  const [title, setTitle] = useState(game.title);
  const [description, setDescription] = useState(game.description || "");

  const { mutate: updateGame, isPending } = useUpdateGameDetails(game.id);

  const handleSave = () => {
    updateGame(
      { title, description },
      {
        onSuccess: () => toast.success("Game details updated."),
        onError: () => toast.error("Failed to update game details."),
      }
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Game Details</h2>
      <Label>Title</Label>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter game title"
        disabled={isPending}
      />
      <Label>Description</Label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter game description"
        disabled={isPending}
      />
      <Button onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
