import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { GameResourceDO } from "@/lib/types/custom";
import { useQueryClient } from "../useQueryClient";

export const useAdminGameResources = () => {
  return useQuery<GameResourceDO[]>({
    queryKey: ["admin", "resources"],
    queryFn: () => fetcher("/api/admin/resources"),
  });
};

export const useDeleteGameResource = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: string) => {
        const res = await fetch(`/api/admin/resources/${id}`, {
          method: "DELETE",
        });
  
        if (!res.ok) {
          throw new Error("Failed to delete resource");
        }
  
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "game_resources"] });
      },
    });
  };