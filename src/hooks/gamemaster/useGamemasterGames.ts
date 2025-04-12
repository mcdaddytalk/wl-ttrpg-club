import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { GMGameSummaryDO, GMGameDO } from "@/lib/types/custom";

export const useGamemasterGames = () => {
  const query = useQuery<GMGameSummaryDO[]>({
    queryKey: ["gamemaster", "games"],
    queryFn: () => fetcher("/api/gamemaster/games"),
  });

  return {
    games: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
};

export const useCreateGame = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/gamemaster/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create game");
      }

      return res.json();
    },
  });
};

export const useGameDetails = (id: string) => {
  return useQuery<GMGameDO>({
    queryKey: ["gamemaster", "game", id],
    queryFn: () => fetcher(`/api/gamemaster/games/${id}`),
  });
};