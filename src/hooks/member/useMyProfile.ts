import { useMutation, useQuery } from "@tanstack/react-query"
import { ProfileData } from "@/lib/types/custom"
import fetcher from "@/utils/fetcher"
import { useQueryClient } from "@/hooks/useQueryClient"
import { toast } from "sonner"

export const useMyProfile = (userId: string) => {
    return useQuery<ProfileData>({
        queryKey: ['member', 'profile', userId],
        queryFn: async () => await fetcher(`/api/members/${userId}/profile`),
        enabled: !!userId
    })
}

export const useUpdateMyProfile = (userId: string) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (values: Partial<ProfileData>) => {
            return await fetcher(`/api/members/${userId}/profile`, {
              method: "PATCH",
              body: JSON.stringify(values),
            })
        },
        onSuccess: (_, updatedProfile) => {
            queryClient.setQueryData(['members', 'profile', userId], updatedProfile)
            toast.success("Profile updated successfully!")
          },
          onError: (error: Error) => {
            toast.error(error.message || "Failed to update profile.")
          },
    });
}