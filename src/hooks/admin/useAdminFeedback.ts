import { useMutation, useQuery } from "@tanstack/react-query";
import { FeedbackDO } from "@/lib/types/custom";
import fetcher from "@/utils/fetcher";
import { useQueryClient } from "../useQueryClient";

export const useAdminFeedback = () => {
  return useQuery<FeedbackDO[]>({
    queryKey: ["admin", "feedback"],
    queryFn: async () => await fetcher<FeedbackDO[]>("/api/admin/feedback")
  });
};

export const useHandleFeedback = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: string) => fetcher(`/api/admin/feedback/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "feedback"] });
      },
    });
  };