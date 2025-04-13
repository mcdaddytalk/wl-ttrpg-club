import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";
import { RoleDO } from "@/lib/types/custom";



export const useAllRoles = () => {
    return useQuery({
        queryKey: ['admin', 'roles', 'all'],
        queryFn: async () => {
            const res = await fetch('/api/roles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!res.ok) {
                throw new Error('Failed to fetch roles');
            }
            const data = await res.json();
            return data as RoleDO[];
        }
    })        
}

export const useUpdateRoles = (memberId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (roleIds: string[]) => {
        const res = await fetch(`/api/admin/members/${memberId}/roles`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roles: roleIds })
        });
        if (!res.ok) throw new Error("Failed to update roles");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "members", memberId] });
      }
    });
};
  