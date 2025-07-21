import { ContactListDO } from "@/lib/types/data-objects";
import { useQueryClient } from "../useQueryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import logger from "@/utils/logger";



export const useAdminGamemasters = () => {
    return useQuery({
        queryKey: ['admin", "gamemasters'],
        queryFn: async () => {
            return await fetcher<ContactListDO[]>(`/api/admin/gamemasters`);
        },
    })
}

export const useAdminAssignGamemaster = (gameId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newGMId: string) => {
            logger.debug(`Assigning GM ${newGMId} to game ${gameId}`);
            return fetcher(`/api/admin/games/${gameId}/gamemaster`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newGMId })
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:['admin', 'games'] });
        }
    })
}