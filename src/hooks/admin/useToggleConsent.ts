import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, newConsent }: { memberId: string; newConsent: boolean }) => {
      const res = await fetch(`/api/admin/members/${memberId}/toggle-consent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: newConsent }),
      });

      if (!res.ok) throw new Error("Failed to update consent.");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "members"] });
    },
  });
};
