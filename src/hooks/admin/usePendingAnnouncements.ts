import { useQuery } from '@tanstack/react-query';
import { PendingAnnouncementsStats } from '@/lib/types/stats';

export function usePendingAnnouncements() {
  return useQuery<PendingAnnouncementsStats>({
    queryKey: ['admin', 'pending-announcements'],
    queryFn: async () => {
      const res = await fetch('/api/admin/announcements/pending');
      if (!res.ok) throw new Error('Failed to fetch pending announcements');
      return res.json();
    },
  });
}