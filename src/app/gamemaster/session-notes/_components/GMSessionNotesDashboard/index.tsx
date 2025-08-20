"use client"

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GMSessionNoteDO } from "@/lib/types/custom";
import { SessionNoteEditor } from "../SessionNoteEditor";
import { useGamemasterGames } from "@/hooks/gamemaster/useGamemasterGames";
import { useGamemasterSessionNotes } from "@/hooks/gamemaster/useGamemasterSessionNotes";
import GMSessionNoteListItem from "../GMSessionNoteListItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import logger from "@/utils/logger";

export default function GMSessionNotesDashboard() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<GMSessionNoteDO | null>(null);
  const [gameFilter, setGameFilter] = useState<string>("all");

  const { games } = useGamemasterGames();
  const { notes = [], isLoading: loadingNotes, refetch } = useGamemasterSessionNotes(gameFilter === "all" ? undefined : gameFilter);

  const currentGameTitle = useMemo(
      () => (gameFilter === "all" ? "All Games" : (games.find(g => g.id === gameFilter)?.title ?? "Selected Game")),
      [gameFilter, games]
    );
  
  const openNewNote = () => {
    logger.debug("Opening new note")
    setSelectedNote(null);
    setEditorOpen(true);
  };

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold">Game Session Notes</CardTitle>

          <div className="flex items-center gap-2">
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All games</SelectItem>
                {games.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={openNewNote}>+ New Note</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing: <span className="font-medium">{currentGameTitle}</span>
          </p>

          {/* Notes container lives INSIDE the card now */}
          <div
            className={cn(
              "rounded-lg border bg-muted/30 p-3 md:p-4",
              "min-h-[120px]"
            )}
          >
            {loadingNotes ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-3 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            ) : notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No session notes yet{gameFilter !== "all" ? " for this game" : ""}.
                </p>
                <Button onClick={openNewNote} variant="outline">Create your first note</Button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {notes.map((note) => (
                  <GMSessionNoteListItem
                    key={note.id}
                    note={note}
                    onSelect={(n) => { 
                      logger.debug("Selected note", n);
                      setSelectedNote(n); 
                      setEditorOpen(true); 
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SessionNoteEditor
        isOpen={isEditorOpen}
        onCancel={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          toast.success("Note saved");
          refetch();
        }}
        note={selectedNote ?? null}
        defaultGameId={gameFilter !== "all" ? gameFilter : undefined}
        games={games}
      />
    </section>
  );
}