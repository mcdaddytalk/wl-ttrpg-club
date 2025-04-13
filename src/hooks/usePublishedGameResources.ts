import { useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { GameResourceDO, ResourceVisibility } from "@/lib/types/custom";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";

type PublishedVisibility = Exclude<ResourceVisibility, "admins">;

export const usePublishedGameResources = (
    role: PublishedVisibility = "public",
    filters: GameResourceFilterParams = {}
) => {
    const visibilityOrder: Record<PublishedVisibility, PublishedVisibility[]> = {
        public: ['public'],
        members: ['public', 'members'],
        gamemasters: ['public', 'members', 'gamemasters'],
    };

    const allowedVisibilities = visibilityOrder[role];

    return useQuery<GameResourceDO[]>({
        queryKey: ["game_resources", "published", role, filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set("published", "true");
            params.set("deleted", "false");
            
            // role-based visibility
            allowedVisibilities.forEach((v) => params.append("visibility", v));

            // apply filters
            if (filters.category) params.set("category", filters.category);
            if (filters.pinned !== undefined) params.set("pinned", String(filters.pinned));
            if (filters.search) params.set("search", filters.search);
      
            return fetcher("/api/resources", undefined, params);
          },
    });
}