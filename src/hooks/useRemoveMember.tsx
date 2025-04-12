import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";
import { useSearchParams } from "next/navigation";
import { searchParamsCache } from "@/app/admin/_lib/adminMembers";

interface RemoveMemberVariables {
    userId: string;
    adminId: string;
}

export const useRemoveMember = () => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const params = searchParamsCache.parse(Object.fromEntries(searchParams.entries()));
    

    return useMutation({
        mutationFn: async ({ 
            userId,
            adminId
        }: RemoveMemberVariables) => {
            const response = await fetch("/api/admin/remove-member", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ memberId: userId, deletedBy: adminId }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove member");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'members', 'full', params] }) ;
        },
    });
};