import { GMSessionNoteDO } from "@/lib/types/custom";
import { SessionNoteFormValues } from "@/lib/validation/sessionNotes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";

export function useGamemasterSessionNotes() {
    return useQuery<GMSessionNoteDO[]>({
      queryKey: ["gamemaster", "session_notes"],
      queryFn: async () => {
        const res = await fetch("/api/gamemaster/session-notes");
        if (!res.ok) throw new Error("Failed to load session notes");
        return res.json();
      },
    });
  }

export function useSaveSessionNote(
  noteId?: string,
  onSaved?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: SessionNoteFormValues) => {
      const method = noteId ? "PATCH" : "POST";
      const url = noteId ? `/api/gamemaster/session-notes/${noteId}` : "/api/gamemaster/session-notes";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save session note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gm", "session_notes"] });
      if (onSaved) onSaved();
    },
  });
}

export function useDeleteSessionNote() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (noteId: string) => {
        const res = await fetch(`/api/gamemaster/session-notes/${noteId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete note");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["gm", "session_notes"] });
      }
    }); 
}
  