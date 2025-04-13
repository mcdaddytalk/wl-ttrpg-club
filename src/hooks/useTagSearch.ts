import { useQuery } from '@tanstack/react-query';

export const useTagSearch = (query: string) =>
  useQuery({
    queryKey: ['tag-search', query],
    queryFn: async () => {
      if (!query || query.length < 1) return [];
      const res = await fetch(`/api/tags?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search tags');
      return await res.json() as { id: string; name: string }[];
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
