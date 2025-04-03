import { useQuery } from '@tanstack/react-query';

export function useAnnouncementsRead(userId?: string) {
  return useQuery({
    queryKey: ['announcement-reads', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/members/${userId}/announcements`);
      if (!res.ok) throw new Error('Failed to load reads');
      return res.json() as Promise<{ announcement_id: string }[]>;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}