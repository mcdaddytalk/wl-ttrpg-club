import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";

export const useTogglePlayerRegistration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ 
                userId,
                gmId, 
                gameId,
                status,
                status_note 
        }: { 
            userId: string,
            gmId: string, 
            gameId: string,
            status: 'pending' | 'approved' | 'rejected',
            status_note?: string 
        }) => {
            const response = await fetch(`/api/games/${gameId}/registrants`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        member_id: userId,
                        status,
                        status_note: status_note || "",
                        updated_by: gmId
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to toggle player registration');
            }

            return response.json();
        },
        onError: (error) => {
            console.error(
                'Error toggling player registration:',
                error
            )
        },
        onSuccess: (_data, { gmId, gameId }) => {
            queryClient.invalidateQueries({ queryKey: ['games', gmId, 'gm', 'full'] });
            queryClient.invalidateQueries({ queryKey: ['players', gmId , gameId] });
        }
    })
}