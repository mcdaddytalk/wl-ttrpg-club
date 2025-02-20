import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import { RegisteredGameDO } from "@/lib/types/custom";
import { useAuth } from "@/hooks/useAuth";
import { addDays, formatISO } from "date-fns";

export const useMyGames = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Fetch registered games
  const { data: games, error, isLoading } = useQuery<RegisteredGameDO[]>({
    queryKey: ["myGames", user?.id],
    queryFn: () => fetcher(`/api/members/${user?.id}/my-games`),
    enabled: !!user?.id,
  });

  // ✅ Fetch upcoming games in the next two weeks
  const startDate = formatISO(new Date()); // Today
  const endDate = formatISO(addDays(new Date(), 14)); // 2 weeks ahead

  const { data: upcomingGames, isLoading: loadingUpcoming } = useQuery<RegisteredGameDO[]>({
    queryKey: ["upcomingGames", user?.id, startDate, endDate],
    queryFn: () => fetcher(`/api/members/${user?.id}/my-games?start=${startDate}&end=${endDate}`),
    enabled: !!user?.id,
  });

  // ✅ Leave game mutation
  const leaveGame = useMutation({
    mutationFn: async (gameId: string) => {
      return fetcher(`/api/members/${user?.id}/my-games/${gameId}`, { method: "DELETE" });
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myGames", user?.id] })
        queryClient.invalidateQueries({ queryKey: ["upcomingGames", user?.id] })
    },
  });

  return { games, upcomingGames, error, isLoading, loadingUpcoming, leaveGame };
};
