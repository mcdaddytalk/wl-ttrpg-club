import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GMSessionNoteDO } from "@/lib/types/custom";
import { SessionNoteEditor } from "../SessionNoteEditor";

export default function GMSessionNotesDashboard() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<GMSessionNoteDO | null>(null);

  const { data: notes = [], isLoading } = useQuery<GMSessionNoteDO[]>({
    queryKey: ["gm", "session_notes"],
    queryFn: async () => {
      const res = await fetch("/api/gamemaster/session-notes");
      if (!res.ok) throw new Error("Failed to load session notes");
      return res.json();
    },
  });

  const openNewNote = () => {
    setSelectedNote(null);
    setEditorOpen(true);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Session Notes</h1>
        <Button onClick={openNewNote}>+ New Note</Button>
      </div>

      {isLoading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-muted-foreground">No session notes yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="cursor-pointer hover:shadow" onClick={() => { setSelectedNote(note); setEditorOpen(true); }}>
              <CardHeader>
                <CardTitle>{note.title || "Untitled"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {new Date(note.session_date).toLocaleDateString()} • {note.is_visible_to_players ? "Player-visible" : "GM-only"}
                </p>
                <p className="line-clamp-3 mt-2 text-sm text-muted-foreground">{note.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SessionNoteEditor
        isOpen={isEditorOpen}
        onCancel={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          toast.success("Note saved");
        }}
        note={selectedNote}
      />
    </section>
  );
}
