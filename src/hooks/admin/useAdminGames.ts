import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";
import { SupaGMGameData } from "@/lib/types/custom";

export const useAvailableGames = () => {
    return useQuery({
      queryKey: ["admin", "games", "select-options"],
      queryFn: async () => {
        const res = await fetch("/api/admin/games/available");
        if (!res.ok) throw new Error("Failed to fetch games");
        return res.json() as unknown as SupaGMGameData[]; // expected: [{ id, title, gm_id, gm_name }]
      },
    });
};

export const useArchiveGame = (gameId: string) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (archived: boolean) => {
        const res = await fetch(`/api/admin/games/${gameId}/archive`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ archived }),
        });
        if (!res.ok) throw new Error("Failed to update archive status");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "games"] });
      }
    });
  };