import logger from "@/utils/logger";
import { useQueryClient } from "./useQueryClient";
import { useMutation } from "@tanstack/react-query";



interface RemoveLocationVariables {
    locationId: string;
}

export const useRemoveLocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            locationId
        }: RemoveLocationVariables) => {
            const response = await fetch(`/api/locations`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locationId }),
            });

            if (!response.ok) {
                throw new Error("Error removing location");
            }            
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations', 'full'] }) ;
        },
        onError: () => {
            logger.error("Error removing location");
        }
    })
}