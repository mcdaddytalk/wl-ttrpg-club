export function getMemberByIdQueryOptions(id: string) {
  return {
    queryKey: ["admin", "members", id] as const,
    queryFn: async () => {
      return fetch(`/api/admin/members/${id}`).then((res) => res.json());},
  };
}