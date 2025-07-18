import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import {  GMGameSummaryDO, GMGameDO } from "@/lib/types/data-objects";
import { useQueryClient } from "../useQueryClient";

export const useGamemasterGames = () => {
  const query = useQuery<GMGameSummaryDO[]>({
    queryKey: ["gamemaster", "games", "summary"],
    queryFn: () => fetcher("/api/gamemaster/games"),
  });

  return {
    games: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
};

export const useGamemasterGamesFull = () => {
  const query = useQuery<GMGameDO[]>({
    queryKey: ["gamemaster", "games", "full"],
    queryFn: () => fetcher("/api/gamemaster/games/full"),
  });

  return {
    games: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export const useCreateGame = () => {
  return useMutation({
    mutationFn: (payload: any) => fetcher<GMGameDO>("/api/gamemaster/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
  });
};

export const useGameDetails = (id: string) => {
  return useQuery<GMGameDO>({
    queryKey: ["gamemaster", "game", id],
    queryFn: () => fetcher(`/api/gamemaster/games/${id}`),
  });
};

export const useUpdateGameDetails = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return await fetcher(`/api/gamemaster/games/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamemaster", "games", "full"] });
      queryClient.invalidateQueries({ queryKey: ["gamemaster", "game", id] });
    }
  });
}

export const useRefreshGames = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["gamemaster", "games", "summary"] });
    },
  });
};

export const useRefreshGamesFull = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["gamemaster", "games", "full"] });
    },
  });
};

export const useDeleteGame = (gamemasterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetcher(`/api/gamemaster/games/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gamemasterId }),
      });

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamemaster", "games"] });
    }
  });
};