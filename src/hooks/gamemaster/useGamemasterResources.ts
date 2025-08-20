import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";
import fetcher from "@/utils/fetcher";
import { GameResourceDO } from "@/lib/types/data-objects";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";

export const useGamemasterGameResources = (filters: GameResourceFilterParams = {}) => {
  return useQuery<GameResourceDO[]>({
    queryKey: ["game_resources", "gamemaster", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.game_id) params.set("game_id", filters.game_id);
      if (filters.category) params.set("category", filters.category);
      if (filters.pinned !== undefined) params.set("pinned", String(filters.pinned));
      if (filters.search) params.set("search", filters.search);

      return fetcher(`/api/gamemaster/resources`, undefined, params);
    },
  });
};

export const useUploadGameResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return fetcher(`/api/gamemaster/resources`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game_resources", "gamemaster"] });
    },
  });
};

export const useDeleteGameResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      return fetcher(`/api/gamemaster/resources/${resourceId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game_resources", "gamemaster"] });
    },
  });
};