import { MemberDO } from "@/lib/types/data-objects";
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

  export const useAdminMember = (id: string) =>
    useQuery<MemberDO>({
      queryKey: ['admin-member', id],
      queryFn: async () => {
        const res = await fetch(`/api/admin/members/${id}`);
        if (!res.ok) throw new Error('Failed to load member');
        return await res.json();
      }
    });
  