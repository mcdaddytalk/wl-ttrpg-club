import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient"
import { LocationType } from "@/lib/types/custom";
import logger from "@/utils/logger";



export const useAddLocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            scope,
            created_by,
            name,
            type,
            address,
            url,
            gamemasters
        }: {
            scope: string;
            created_by: string;
            name: string;
            type: LocationType;
            address?: string;
            url?: string;
            gamemasters?: string[]
        }) => {
            const response = await fetch(`/api/locations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scope,
                    created_by,
                    name,
                    type,
                    address,
                    url,
                    gamemasters
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add location");
            }

            return response.json()
        },
        onSuccess: (_data, variables) => {
            const { scope } = variables;
            queryClient.invalidateQueries({ queryKey: ['locations', scope, 'full'] }) ;
        },
        onError: () => {
            logger.error("Failed to add location");
        }
    });
}