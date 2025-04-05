import { MemberDO } from "@/lib/types/custom";
import { useQuery } from "@tanstack/react-query";

export const useAdminMembers = () =>
    useQuery<MemberDO[]>({
      queryKey: ['admin-members'],
      queryFn: async () => {
        const res = await fetch('/api/admin/members');
        if (!res.ok) throw new Error('Failed to load members');
        return await res.json();
      }
    });
  