import fetcher from "@/utils/fetcher";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";
import { toast } from "sonner";
import { InviteDO } from "@/lib/types/data-objects";



export function useGamemasterInvites(gamemasterId?: string) {
    return useQuery<InviteDO[]>({
      queryKey: ["invites", "full", { gamemaster_id: gamemasterId }],
      queryFn: () => fetcher<InviteDO[]>("/api/gamemaster/invites"),
      enabled: !!gamemasterId,
    });
  }
  
  export function useRefreshInvites(gamemasterId?: string) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: () => fetcher<InviteDO[]>("/api/gamemaster/invites"),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["invites", "full", { gamemaster_id: gamemasterId }] });
      },
    });
  }

  export function useDeleteInvite(gamemasterId?: string) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (invite_id: string) => fetcher<InviteDO[]>("/api/gamemaster/invites", {
        method: "DELETE",
        body: JSON.stringify({ invite_id }),
      }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["invites", "full", { gamemaster_id: gamemasterId }] });
      },
    });
  }

  export const useResendInvite = () => {
    return useMutation({
      mutationFn: async (inviteId: string) => {
        return await fetcher(`/api/gamemaster/invites/${inviteId}/resend`, {
          method: "POST",
        });
      },
      onSuccess: () => {
        toast.success("Invite resent successfully.");
      },
      onError: () => {
        toast.error("Failed to resend invite.");
      },
    });
  };