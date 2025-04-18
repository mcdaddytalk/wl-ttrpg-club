import logger from "@/utils/logger";
import { useQueryClient } from "./useQueryClient";
import { useMutation } from "@tanstack/react-query";
import { LocationScope } from "@/lib/types/custom";



interface RemoveLocationVariables {
    locationId: string;
    scope: LocationScope;
}

export const useRemoveLocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            locationId,
            scope
        }: RemoveLocationVariables) => {
            const response = await fetch(`/api/locations`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locationId, scope }),
            });

            if (!response.ok) {
                throw new Error("Error removing location");
            }            
        },
        onSuccess: (_data, variables) => {
            const { scope } = variables;
            queryClient.invalidateQueries({ queryKey: ['locations', scope, 'full'] }) ;
        },
        onError: () => {
            logger.error("Error removing location");
        }
    })
}