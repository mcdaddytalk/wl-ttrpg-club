import { GameData, GameFavorite, GameRegistration } from "@/lib/types/custom";
import fetcher from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";


export const useGameDetails = (id: string, memberId: string) => {
    return useQuery<GameData>({
        queryKey: ['games', id, memberId],
        queryFn: async () => {
            const response = await fetcher<GameData>(`/api/games/${id}`)
            response.favorite = response.favoritedBy.some((favorite: GameFavorite) => favorite.member_id === memberId);
            response.registered = response.registrations.some((registrant: GameRegistration) => registrant.member_id === memberId && registrant.status === 'approved');
            response.pending = response.registrations.some((registrant: GameRegistration) => registrant.member_id === memberId && registrant.status === 'pending');
                        
            return response
        },
        enabled: !!memberId
    });
};

export const useAllMyGameDetails = (memberId: string) => {
    return useQuery<GameData[]>({
        queryKey: ['games', memberId, 'all'],
        queryFn: async () => {
            const response = await fetcher<GameData[]>(`/api/games?member_id=${memberId}`)
            return response
        },
        enabled: !!memberId
    });
};