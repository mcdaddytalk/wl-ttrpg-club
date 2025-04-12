import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminNoteDO } from "@/lib/types/custom";
import fetcher from "@/utils/fetcher";

// export const useAddAdminNote = (memberId: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (note: string) => {
//       const res = await fetch(`/api/admin/members/${memberId}/admin-notes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ note }),
//       });
//       if (!res.ok) throw new Error("Failed to add note");
//       return res.json();
//     },
//     onSuccess: (data) => {
//         const { memberId } = data;
//         queryClient.invalidateQueries({ queryKey: ['admin', 'members', 'full', memberId] }) ;
//     },
//   });
// };

export const useAdminNotes = () => {
  return useQuery<AdminNoteDO[]>({
    queryKey: ["admin", "notes"],
    queryFn: () => fetcher("/api/admin/notes"),
  });
};

export const useDeleteAdminNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (noteId: string) => {
            const res = await fetch(`/api/admin/notes/${noteId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete note");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "notes"] });
        },
    });
};

export const useAddUpdateAdminNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values: Partial<AdminNoteDO>) => {
            const method = values.id ? "PATCH" : "POST";
            const url = values.id ? `/api/admin/notes/${values.id}` : `/api/admin/notes`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error("Failed to save note");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "notes"] });
        },
    });
};