import { useQuery } from '@tanstack/react-query';
import { AnnouncementDO } from '@/lib/types/custom';
import fetcher from '@/utils/fetcher';

export const useAnnouncements = (published = true) => {
    const params = new URLSearchParams({ published: published.toString() });
    
    const { data: announcements, error, isError, isLoading } = useQuery<AnnouncementDO[]>({
        queryKey: ['announcements', params],
        queryFn: ({ queryKey }) => {
            const [, searchParams] = queryKey as [string, URLSearchParams];
            return fetcher('/api/announcements', undefined, searchParams)
        },
    })
    
    return { announcements, error, isError, isLoading };
};