import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";
import logger from '@/utils/logger';

export const useAddMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            email,
            given_name,
            surname,
            is_minor
        }: {
            email: string;
            given_name: string;
            surname: string;
            is_minor: boolean;
        }) => {
            const response = await fetch(`/api/admin/members`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    given_name,
                    surname,
                    is_minor
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add member");
            }
            
            return response.json();            
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:['members', 'admin', 'full'] });
        },
        onError: (error) => {
            logger.error("Error adding member:", error);
        },
    });
};