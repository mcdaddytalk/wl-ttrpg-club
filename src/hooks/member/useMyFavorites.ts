import { GameFavorite } from "@/lib/types/custom"
import fetcher from "@/utils/fetcher"
import { useQuery } from "@tanstack/react-query"


export const useMyFavorites = (userid: string) => {
    return useQuery({
        queryKey: ['member', 'favorites', userid],
        queryFn: async () => await fetcher<GameFavorite[]>(`/api/members/${userid}/favorites`),
        enabled: !!userid
    })
}