import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { Player } from "@/lib/types/custom";

import { useQueryClient } from "../useQueryClient";
import { GMGamePlayerDO, MemberDO } from "@/lib/types/data-objects";
export const useGameMembers = () => {
    const query = useQuery<MemberDO[]>({
        queryKey: ["gamemaster", "members"],
        queryFn: () => fetcher(`/api/members`),
    })

    return { 
        members: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    }
}

export const useGamePlayers = (gameId: string) => {
  return useQuery<GMGamePlayerDO[]>({
    queryKey: ["gamemaster", "game_players", gameId],
    queryFn: () => fetcher(`/api/gamemaster/games/${gameId}/players`),
  });
};

export const useGameRegistrants = (gameId: string) => {
  return useQuery<Player[]>({
    queryKey: ["gamemaster", "game_registrants", gameId],
    queryFn: () => fetcher(`/api/games/${gameId}/registrants`),
    enabled: !!gameId
  });
}

export const useRefreshRegistrants = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (gameId: string) => {
        if (!gameId) return;
        return await queryClient.invalidateQueries({ queryKey: ["gamemaster", "game_registrants", gameId] });
      },
    });
}

type RemovePlayerPayload = {
    member_id: string;
    status: "rejected" | "banned";
    note: string;
  };

export const useRemovePlayer = (gameId: string) => {
    const queryClient = useQueryClient();

    return useMutation<unknown, Error, RemovePlayerPayload>({
        mutationFn: async ({ member_id, status, note }) => {
            const res = await fetch(`/api/gamemaster/games/${gameId}/players/${member_id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status, status_note: note }),
            });
            if (!res.ok) throw new Error("Failed to remove player");
            return res.json();
          },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["gamemaster", "game_players", gameId] });
        },
      });
};

export const useRefreshPlayers = (gameId: string) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
        return await queryClient.invalidateQueries({ queryKey: ["gamemaster", "game_players", gameId] });
        },
    });
};