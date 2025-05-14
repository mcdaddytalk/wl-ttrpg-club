import { searchGamesParamsCache } from "@/app/admin/_lib/adminGames";
import { GMGameDataDO } from "@/lib/types/data-objects";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";


interface PaginatedGamesResponse {
  games: GMGameDataDO[];
  pageCount: number;
}

export const usePaginatedGames = () => {
  const searchParams = useSearchParams();
  const parsedParams = searchGamesParamsCache.parse(Object.fromEntries(searchParams.entries()));

  return useQuery<PaginatedGamesResponse>({
    queryKey: ["admin", "games", parsedParams],
    queryFn: async () => {
      const res = await fetch("/api/admin/games/params", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedParams),
      });

      if (!res.ok) throw new Error("Failed to fetch games");
      const data = await res.json();
      const pageCount = Math.ceil(data.count / parsedParams.pageSize);
      return { games: data.games, pageCount };
    },
  });
};