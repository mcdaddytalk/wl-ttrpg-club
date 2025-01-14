import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";

export const useTransferGame = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            game_title,
            old_gm_id,
            old_gm_name,
            new_gm_id
        }: {
            id: string;
            game_title: string;
            old_gm_id: string;
            old_gm_name: string;
            new_gm_id: string
        }) => {
            const game_id = id;
            const response = await fetch(`/api/games/${game_id}/transfer`,                 
        {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    game_id,
                    game_title,
                    updated_by: old_gm_id,
                    updated_by_name: old_gm_name,
                    gamemaster_id: new_gm_id
                }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSuccess: (_data, { old_gm_id, new_gm_id }) => {
                queryClient.invalidateQueries({ queryKey: ["games", old_gm_id, "gm", "full"] });
                queryClient.invalidateQueries({ queryKey: ["games", new_gm_id, "gm", "full"] });
        },
        onError: (error) => {
            console.error(error);
        }
    });
};