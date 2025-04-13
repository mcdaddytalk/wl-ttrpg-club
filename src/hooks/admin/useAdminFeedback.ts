import { useMutation, useQuery } from "@tanstack/react-query";
import { FeedbackDO } from "@/lib/types/custom";
import fetcher from "@/utils/fetcher";
import { useQueryClient } from "../useQueryClient";

export const useAdminFeedback = () => {
  return useQuery<FeedbackDO[]>({
    queryKey: ["admin", "feedback"],
    queryFn: async () => {
      const res = await fetcher<FeedbackDO[]>("/api/admin/feedback");
      return res;
    },
  });
};

export const useHandleFeedback = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: string) => {
        const res = await fetch(`/api/admin/feedback/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!res.ok) throw new Error("Failed to mark feedback as handled");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "feedback"] });
      },
    });
  };