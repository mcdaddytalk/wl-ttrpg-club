import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";

interface ToggleFavoriteVariables {
  userId: string;
  gameId: string;
  favorite: boolean;
}



export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            gameId,
            favorite
        }: ToggleFavoriteVariables) => {
            if (favorite) {
                // console.log("Removing favorite for game ID:", gameId);
                  const response = await fetch(`/api/members/${userId}/favorites`,
                    {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ game_id: gameId })
                    }
                  );
              
                  if (!response.ok) {
                    throw new Error("Error toggling favorite");
                  }
                } else {
                // console.log("Adding favorite for game ID:", gameId);
                  const response = await fetch(`/api/members/${userId}/favorites`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ game_id: gameId })
                    }
                  );
              
                  if (!response.ok) {
                    throw new Error("Error toggling favorite");
                  }
                }
        },
        onSuccess: (_data, { userId, gameId }) => {
            queryClient.invalidateQueries({ queryKey: ['games', userId, 'full'] });
            queryClient.invalidateQueries({ queryKey: ['games', 'favorites', userId] });
            queryClient.invalidateQueries({ queryKey: ['games', userId, gameId] });
        },
        onError: (error) => {
            console.error('Error toggling favorite:', error);
        }
    })
}