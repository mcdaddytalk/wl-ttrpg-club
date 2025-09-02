import { ContactSubmission } from '@/lib/types/custom';
import fetcher from '@/utils/fetcher';
import { useQuery } from '@tanstack/react-query';

export function useContactSubmissions() {
  const result = useQuery<ContactSubmission[]>({
    queryKey: ['admin', 'contact-submissions'],
    queryFn: async () => fetcher<ContactSubmission[]>('/api/admin/contact-submissions')
  });

  return {
    data: result.data as ContactSubmission[] || [],
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error, 
    refetch: result.refetch
  }
}
