import { useQuery } from '@tanstack/react-query';
import { AdminTaskStats } from '@/lib/types/stats';

export function useAdminTasksSummary() {
  return useQuery<AdminTaskStats>({
    queryKey: ['admin', 'tasks-summary'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tasks/summary');
      if (!res.ok) throw new Error('Failed to fetch task summary');
      return res.json();
    },
  });
}