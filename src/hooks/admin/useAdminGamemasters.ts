import { ContactListDO, MemberDO } from "@/lib/types/data-objects";
import { useQueryClient } from "../useQueryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";



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
            const response = await fetch(`/api/admin/games/${gameId}/gamemaster`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newGMId })
            }
            ).then((res) => {
                if (!res.ok) {
                    throw new Error('Error fetching game');
                }
                return res.json() as Promise<MemberDO[]>;
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:['admin", "games'] });
        }
    })
}