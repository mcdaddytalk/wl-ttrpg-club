import { GMAnalytics } from "@/lib/types/custom";
import { useQuery } from "@tanstack/react-query";


export function useGamemasterAnalytics() {
    const query = useQuery<GMAnalytics>({
        queryKey: ["gamemaster", "analytics"],
        queryFn: async () => {
          const res = await fetch("/api/gamemaster/analytics");
          if (!res.ok) throw new Error("Failed to fetch analytics");
          return res.json();
        },
    });

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch
    }
}