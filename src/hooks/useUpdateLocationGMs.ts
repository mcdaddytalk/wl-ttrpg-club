import createSupabaseBrowserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import logger from '@/utils/logger';

export const useUpdateLocationGMs = () => {
    const supabase = createSupabaseBrowserClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            locationId,
            selectedGMs,
            currentGMs
        }: {
            locationId: string;
            selectedGMs: string[];
            currentGMs: string[];
        }) => {
            // Determine gms to add and remove
            const gmsToAdd = selectedGMs.filter((gmId) => !currentGMs.includes(gmId));
            const gmsToRemove = currentGMs.filter((gmId) => !selectedGMs.includes(gmId));
      
            // Add new gms
            if (gmsToAdd.length > 0) {
              const newGMs = gmsToAdd.map((gmId) => ({
                location_id: locationId,
                gamemaster_id: gmId
              }));
              const { error: addError } = await supabase.from("location_perms").insert(newGMs);
              if (addError) throw addError;
            }
      
            // Remove gms
            if (gmsToRemove.length > 0) {
              const { error: removeError } = await supabase
                .from("location_perms")
                .delete()
                .in("gamemaster_id", gmsToRemove)
                .eq("location_id", locationId);
              if (removeError) throw removeError;
            }
          },
          onSuccess: () => {
            // Invalidate the `members` query to refresh the data
            queryClient.invalidateQueries({ queryKey: ['locations', 'admin', 'full'] });
          },
          onError: (error) => {
            logger.error('Error updating gms:', error);
          },
    });
}