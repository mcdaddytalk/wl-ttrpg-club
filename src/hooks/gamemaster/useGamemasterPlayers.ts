import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { GMGamePlayerDO, MemberDO } from "@/lib/types/custom";
import { useQueryClient } from "../useQueryClient";

export const useGameMembers = () => {
    return useQuery<MemberDO[]>({
        queryKey: ["gamemaster", "members"],
        queryFn: () => fetcher(`/api/members`),
    })
}

export const useGamePlayers = (gameId: string) => {
  return useQuery<GMGamePlayerDO[]>({
    queryKey: ["gamemaster", "game_players", gameId],
    queryFn: () => fetcher(`/api/gamemaster/games/${gameId}/players`),
  });
};

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
