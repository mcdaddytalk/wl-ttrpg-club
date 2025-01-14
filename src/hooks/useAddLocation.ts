import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient"
import { LocationType } from "@/lib/types/custom";
import logger from "@/utils/logger";



export const useAddLocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            name,
            type,
            address,
            url
        }: {
            name: string;
            type: LocationType;
            address?: string;
            url?: string;
        }) => {
            const response = await fetch(`/api/locations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    type,
                    address,
                    url
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add location");
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations', 'full'] }) ;
        },
        onError: () => {
            logger.error("Failed to add location");
        }
    });
}