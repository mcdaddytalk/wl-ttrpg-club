import { GMSessionNoteDO } from "@/lib/types/custom";
import { SessionNoteFormValues } from "@/lib/validation/sessionNotes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";
import fetcher from "@/utils/fetcher";

export function useGamemasterSessionNotes(gameId?: string) {
    const query = useQuery<GMSessionNoteDO[]>({
      queryKey: ["gamemaster", "session_notes", { gameId: gameId  ?? "all" }],
      queryFn: () => {
        const qs = gameId ? `?game_id=${gameId}` : "";
        return fetcher(`/api/gamemaster/session-notes${qs}`);
      }
    });

    return {
      notes: query.data ?? [],
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error,
      refetch: query.refetch
    }
  }

export function useSaveSessionNote(
  noteId?: string,
  onSaved?: () => void,
  gameIdForInvalidate?: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: SessionNoteFormValues) => {
      const method = noteId ? "PATCH" : "POST";
      const url = noteId ? `/api/gamemaster/session-notes/${noteId}` : "/api/gamemaster/session-notes";
      return  fetcher(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      // Invalidate both the filtered and the "all" cache
      queryClient.invalidateQueries({ queryKey: ["gamemaster", "session_notes", { gameId: "all" }] });
      if (gameIdForInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["gamemaster", "session_notes", { gameId: gameIdForInvalidate }] });
      }
      onSaved?.();
    },
  });
}

export function useDeleteSessionNote(gameIdForInvalidate?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string) =>
      fetcher(`/api/gamemaster/session-notes/${noteId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamemaster", "session_notes", { gameId: "all" }] });
      if (gameIdForInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["gamemaster", "session_notes", { gameId: gameIdForInvalidate }] });
      }
    },
  });
}
  