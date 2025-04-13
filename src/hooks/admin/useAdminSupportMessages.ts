import { useQuery } from '@tanstack/react-query';
import { SupportMessagesStats } from '@/lib/types/stats';

export function useSupportMessagesSummary() {
  return useQuery<SupportMessagesStats>({
    queryKey: ['admin', 'support-summary'],
    queryFn: async () => {
      const res = await fetch('/api/admin/messages/summary');
      if (!res.ok) throw new Error('Failed to fetch support summary');
      return res.json();
    },
  });
}
