import { useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { ResourceVisibility } from "@/lib/types/custom";
import { GameResourceFilterParams } from "@/lib/validation/gameResources";
import { GameResourceDO  } from "@/lib/types/data-objects";

// type PublishedVisibility = Exclude<ResourceVisibility, "admins">;

export const usePublishedGameResources = (
    role: ResourceVisibility = "public",
    filters: GameResourceFilterParams = {}
) => {
    const visibilityOrder: Record<ResourceVisibility, ResourceVisibility[]> = {
        public: ['public'],
        members: ['public', 'members'],
        gamemasters: ['public', 'members', 'gamemasters'],
        admins: ['public', 'members', 'gamemasters', 'admins'],
    };

    const allowedVisibilities = visibilityOrder[role];
    
    return useQuery<GameResourceDO[]>({
        queryKey: ["game_resources", role, filters],  // removed "published"
        queryFn: async () => {
            const endpoint = role === "admins" 
                ? "/api/admin/resources" 
                : role === 'gamemasters' 
                    ? "/api/gamemaster/resources" 
                    : "/api/resources";

            const params = new URLSearchParams();
            // params.set("published", "true");
            params.set("deleted", "false");
            
            // role-based visibility
            allowedVisibilities.forEach((v) => params.append("visibility", v));

            // apply filters
            if (filters.game_id) params.set("game_id", filters.game_id);
            if (filters.category) params.set("category", filters.category);
            if (filters.pinned !== undefined) params.set("pinned", String(filters.pinned));
            if (filters.search) params.set("search", filters.search);
      
            return fetcher(endpoint, undefined, params);
          },
    });    
}