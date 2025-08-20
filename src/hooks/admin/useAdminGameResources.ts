import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { GameResourceDO } from "@/lib/types/data-objects";
import { useQueryClient } from "../useQueryClient";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";

export const useAdminGameResources = (filters: GameResourceFilterParams = {}) => {
  return useQuery<GameResourceDO[]>({
    queryKey: ["game_resources", "admin", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.game_id) params.set("game_id", filters.game_id);
      if (filters.category) params.set("category", filters.category);
      if (filters.pinned !== undefined) params.set("pinned", String(filters.pinned));
      if (filters.search) params.set("search", filters.search);

      return fetcher(`/api/admin/resources`, undefined, params);
    },
  });
};

export const useAdminUploadGameResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return fetcher(`/api/admin/resources`, { method: "POST", body: formData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game_resources", "admin"] });
    },
  });
};

export const useAdminDeleteGameResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      return fetcher(`/api/admin/resources/${resourceId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game_resources", "admin"] });
    },
  });
};