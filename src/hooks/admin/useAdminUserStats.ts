import { AdminUserStats } from "@/lib/types/stats";
import { useQuery } from "@tanstack/react-query";

export function useAdminUserStats() {
  return useQuery<AdminUserStats>({
    queryKey: ["admin", "user-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/members/summary");
      if (!res.ok) throw new Error("Failed to fetch user stats");
      return res.json();
    },
  });
}