import { useQuery } from "@tanstack/react-query";
import { AuditTrailDO } from "@/lib/types/custom";

export const useAuditTrail = () => {
  return useQuery<AuditTrailDO[]>({
    queryKey: ["admin", "audit-trail"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit");
      if (!res.ok) throw new Error("Failed to fetch audit trail");
      return res.json();
    },
  });
};
