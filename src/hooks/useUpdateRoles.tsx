import useSupabaseBrowserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateRoles = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowserClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      selectedRoles,
      currentRoles,
    }: {
      memberId: string;
      selectedRoles: string[];
      currentRoles: string[];
    }) => {
      // Determine roles to add and remove
      const rolesToAdd = selectedRoles.filter((roleId) => !currentRoles.includes(roleId));
      const rolesToRemove = currentRoles.filter((roleId) => !selectedRoles.includes(roleId));

      // Add new roles
      if (rolesToAdd.length > 0) {
        const newRoles = rolesToAdd.map((roleId) => ({
          member_id: memberId,
          role_id: roleId,
        }));
        const { error: addError } = await supabase.from("member_roles").insert(newRoles);
        if (addError) throw addError;
      }

      // Remove roles
      if (rolesToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("member_roles")
          .delete()
          .in("role_id", rolesToRemove)
          .eq("member_id", memberId);
        if (removeError) throw removeError;
      }
    },
    onSuccess: () => {
      // Invalidate the `members` query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin', 'members', 'full'] });
    },
    onError: (error) => {
      console.error('Error updating roles:', error);
    },
  });
};
