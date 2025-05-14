import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { GMGameScheduleDO } from "@/lib/types/data-objects";
import { useQueryClient } from "@/hooks/useQueryClient";
import { ScheduleUpdateInput } from "@/lib/validation/gameSchedules";

export const useGameSchedule = (gameId: string) => {
  return useQuery<GMGameScheduleDO | null>({
    queryKey: ["gamemaster", "schedule", gameId],
    queryFn: () => fetcher(`/api/gamemaster/games/${gameId}/schedule`),
  });
};

export const useFetchAllGameSchedules = () => {
  return useQuery<GMGameScheduleDO[]>({
    queryKey: ["gamemaster", "schedules"],
    queryFn: () => fetcher("/api/gamemaster/schedules"),
  });
}

export const useUpdateGameSchedule = (gameId: string) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (payload: ScheduleUpdateInput) => {
        return fetcher<GMGameScheduleDO>(`/api/gamemaster/games/${gameId}/schedule`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['gamemaster', 'schedules'] }) // ✅ Refresh the table
        queryClient.invalidateQueries({ queryKey: ["gamemaster", "schedule", gameId] });
      },
    });
  };