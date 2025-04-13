"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGamemasterSessionNotes } from "@/hooks/gamemaster/useGamemasterSessionNotes";
import { format } from "date-fns";

export function SessionNotesCard() {
  const { data: notes = [], isLoading } = useGamemasterSessionNotes();

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Recent Notes</CardTitle>
        <Button asChild variant="link" size="sm">
          <Link href="/gamemaster/session-notes">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {isLoading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <p>No session notes available.</p>
        ) : (
          <ul className="space-y-2">
            {notes.slice(0, 5).map((note) => (
              <li key={note.id} className="border rounded-md p-2">
                <div className="font-medium text-foreground">{note.title || "Untitled Session"}</div>
                <div className="text-xs">
                  {format(new Date(note.session_date), "PPP")} • {note.is_visible_to_players ? "Visible" : "Private"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
