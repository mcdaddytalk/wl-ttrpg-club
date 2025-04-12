import { InviteData } from "@/lib/types/custom";
import fetcher from "@/utils/fetcher";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";



export function useGamemasterInvites(gamemasterId?: string) {
    return useQuery<InviteData[]>({
      queryKey: ["invites", "full", { gamemaster_id: gamemasterId }],
      queryFn: () => fetcher<InviteData[]>("/api/gamemaster/invites"),
      enabled: !!gamemasterId,
    });
  }
  
  export function useRefreshInvites(gamemasterId?: string) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: () => fetcher<InviteData[]>("/api/gamemaster/invites"),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["invites", "full", { gamemaster_id: gamemasterId }] });
      },
    });
  }

  export function useDeleteInvite(gamemasterId?: string) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (invite_id: string) => fetcher<InviteData[]>("/api/gamemaster/invites", {
        method: "DELETE",
        body: JSON.stringify({ invite_id }),
      }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["invites", "full", { gamemaster_id: gamemasterId }] });
      },
    });
  }