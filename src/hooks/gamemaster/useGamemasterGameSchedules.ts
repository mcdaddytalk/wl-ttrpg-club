import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { GMGameScheduleDO } from "@/lib/types/custom";
import { useQueryClient } from "../useQueryClient";

export const useGameSchedule = (gameId: string) => {
  return useQuery<GMGameScheduleDO | null>({
    queryKey: ["gamemaster", "schedule", gameId],
    queryFn: () => fetcher(`/api/gamemaster/games/${gameId}/schedule`),
  });
};

export const useUpdateGameSchedule = (gameId: string) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (payload: any) => {
        const res = await fetch(`/api/gamemaster/games/${gameId}/schedule`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (!res.ok) throw new Error("Failed to update schedule");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["gamemaster", "schedule", gameId] });
      },
    });
  };