import logger from "@/utils/logger";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";

interface ChangeEmailVariables {
    oldEmail: string;
    newEmail: string;
    id: string;
}

export const useSendChangeEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (variables: ChangeEmailVariables) => {
            const { oldEmail, newEmail, id } = variables;
            const res = await fetch(`/api/admin/change-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, oldEmail, newEmail }),
            });
            if (!res.ok) throw new Error("Failed to send change email");
            return res.json();
        },
        onSuccess: (_, { newEmail }) => {
            logger.debug("Change email sent to user: ", newEmail);
            queryClient.invalidateQueries({ queryKey: ["admin", "members", "full"] });
        },
        onError: (error) => {
            logger.error("Error sending change email:", error);
        },
    })        
}