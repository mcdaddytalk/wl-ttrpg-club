import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";
import fetcher from "@/utils/fetcher";
import { Player } from "@/lib/types/custom";
import { InviteDO } from "@/lib/types/data-objects";


export const useCreateInvite = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (payload: any) => {
        const { game_id, invitee, gamemaster_id } = payload;
        const newPayload = {
            invitees: [invitee],
            gamemasterId: gamemaster_id
        }
        const res = await fetch(`/api/games/${game_id}/invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPayload),
        });
        if (!res.ok) throw new Error("Failed to create invite");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "invites"] });
      },
    });
  };

export const useResendInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const res = await fetch(`/api/admin/invites/${inviteId}/resend`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to resend invite");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invites"] });
    },
  });
};

export const useCancelInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const res = await fetch(`/api/admin/invites/${inviteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to cancel invite");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invites"] });
    },
  });
};

export function useAdminGameDetails(gameId?: string) {
  const { data, isLoading, isError } = useQuery({
      queryKey: ["admin", "gameDetails", gameId],
    queryFn:  async () => {
      if (!gameId) throw new Error("No game ID");
      const [invites, players] = await Promise.all([
        fetcher<InviteDO[]>(`/api/admin/games/${gameId}/invites`),
        fetcher<Player[]>(`/api/admin/games/${gameId}/registrations`)
      ]);
      return { invites, players };
    },
    enabled: !!gameId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    invites: data?.invites || [],
    players: data?.players || [],
    isLoading,
    isError,
  };
}