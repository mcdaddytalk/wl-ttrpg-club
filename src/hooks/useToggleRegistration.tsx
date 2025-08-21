import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";
import fetcher from "@/utils/fetcher";
import { GameData, GameRegistration } from "@/lib/types/custom";

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
            const url = `/api/games/${gameId}/registrants`;
            const method = registered ? "DELETE" : "POST";

            return fetcher(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    gameId,
                    gamemasterId
                }),
            });
        },
        
        // 🔹 Immediately reflect changes in the game detail cache
    onMutate: async ({ userId, gameId, registered }) => {
      // cancel queries to avoid race updates
      await queryClient.cancelQueries({ queryKey: ['game', gameId] });
      await queryClient.cancelQueries({ queryKey: ['games'] }); // if you have a list

      const prevGame = queryClient.getQueryData<GameData>(['game', gameId]);

      if (prevGame) {
        // derive new registrations array & counts however your schema expects
        const nextRegs = registered
          ? prevGame.registrations.filter(r => r.member_id !== userId) // resign
          : [
              ...prevGame.registrations,
              { game_id: gameId, member_id: userId, status: 'pending', status_note: '', registered_at: new Date().toISOString() } as GameRegistration, // or 'approved' if auto-approve
            ];

        queryClient.setQueryData<GameData>(['game', gameId], {
          ...prevGame,
          registered: !registered,
          pending: registered ? false : true, // adjust if you auto-approve
          registrations: nextRegs,
        });
      }

      // also update any lists that show badges/seats
      queryClient.setQueriesData<GameData[]>(
        { queryKey: ['games'] }, // your games list key prefix
        (old) => Array.isArray(old)
          ? old.map(g => {
              if (g.game_id !== gameId) return g;
              // mirror the same logic as above
              const nextRegs = registered
                ? g.registrations.filter(r => r.member_id !== userId)
                : [...g.registrations, { game_id: gameId, member_id: userId, status: 'pending', status_note: '', registered_at: new Date().toISOString() } as GameRegistration ] // or 'approved' if auto-approve];

              return {
                ...g,
                registered: !registered,
                pending: registered ? false : true,
                registrations: nextRegs,
              };
            })
          : old
      );

      return { prevGame };
    },

    // rollback if API fails
    onError: (_err, { gameId }, ctx) => {
      if (ctx?.prevGame) {
        queryClient.setQueryData(['game', gameId], ctx.prevGame);
      }
    },

    // ensure truth after server writes
    onSettled: (_data, _err, { userId, gameId }) => {
      queryClient.invalidateQueries({ queryKey: ['game', gameId] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['players', userId, gameId] });
      queryClient.invalidateQueries({ queryKey: ['games', userId, 'full'] });
    },
  });
};
