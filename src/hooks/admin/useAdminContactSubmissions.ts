import { useQuery } from '@tanstack/react-query';

export function useContactSubmissions() {
  return useQuery({
    queryKey: ['admin', 'contact-submissions'],
    queryFn: async () => {
      const res = await fetch('/api/admin/contact-submissions');
      if (!res.ok) throw new Error('Failed to fetch submissions');
      return res.json();
    },
  });
}
