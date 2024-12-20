import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";

interface ToggleRegistrationVariables {
  userId: string;
  gameId: string;
  gamemasterId: string;
  registered: boolean;
}



export const useToggleRegistration= () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            userId,
            gameId,
            gamemasterId,
            registered
        }: ToggleRegistrationVariables) => {
            if (registered) {
                return fetch(`/api/games/${gameId}/registrants`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        gameId,
                        gamemasterId
                    }),
                }).then((res) => res.json());
            } else {
                return fetch(`/api/games/${gameId}/registrants`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        gameId,
                        gamemasterId
                    }),
                }).then((res) => res.json());
            }
        }, 
        onSuccess: (_data, { userId, gameId }) => {
            // Invalidate the `players` query to refresh the data
            queryClient.invalidateQueries({ queryKey: ['games', userId, gameId] })
            queryClient.invalidateQueries({ queryKey: ['players', userId, gameId] });
            // Invalidate the `games` query to refresh the data
            queryClient.invalidateQueries({ queryKey: ['games', userId, 'full'] });
        }
    });
  };
