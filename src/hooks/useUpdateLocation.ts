import logger from "@/utils/logger";
import { useQueryClient } from "./useQueryClient";
import { useMutation } from "@tanstack/react-query";
import { LocationScope } from "@/lib/types/custom";

interface UpdateLocationVariables {
    id: string;
    name: string;
    address: string;
    url: string;
    type: string;
    scope: LocationScope;
}

export const useUpdateLocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            name,
            address,
            url,
            type,
            scope
        }: UpdateLocationVariables) => {
            const response = await fetch(`/api/locations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scope, name, address, url, type }),
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