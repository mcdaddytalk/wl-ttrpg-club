import logger from "@/utils/logger";
import { useMutation } from "@tanstack/react-query";
// import { useQueryClient } from "./useQueryClient";

interface ResetPasswordVariables {
  email: string;
}

export const useSendPasswordReset = () => {
//    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            email
        }: ResetPasswordVariables) => {
            const response = await fetch("/api/admin/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to reset password");
            }
            return response.json();   
        },
        onError: (error) => {
            logger.error("Error resetting password:", error);
        },
        onSuccess: (_, { email }) => {
            logger.debug("Password email sent to user: ", email);
        },
    })
}