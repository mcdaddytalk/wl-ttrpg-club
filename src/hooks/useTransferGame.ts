import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";
import logger from "@/utils/logger";
import fetcher from "@/utils/fetcher";

type TransferGamePayload = {
    game_id: string;
    game_title: string;
    old_gm_id: string;
    old_gm_name: string;
    new_gm_id: string;
};

export const useTransferGame = () => {
    const queryClient = useQueryClient();

    return useMutation< // TData, TError, TVariables
        void,             // your endpoint returns nothing (adjust if it returns JSON)
        unknown,
        TransferGamePayload
    >({
        mutationFn: async ({
            game_id,
            game_title,
            old_gm_id,
            old_gm_name,
            new_gm_id
        }: TransferGamePayload) => {
            return await fetcher<void>(`/api/games/${game_id}/transfer`,                 
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
            })
        },
        onSuccess: (_data, variables) => {
            const { old_gm_id, new_gm_id } = variables;
            queryClient.invalidateQueries({ queryKey: ["games", old_gm_id, "gm", "full"] });
            queryClient.invalidateQueries({ queryKey: ["games", new_gm_id, "gm", "full"] });
        },
        onError: (error: unknown) => {
            logger.error(error);
        }
    });
};