import { useQuery } from '@tanstack/react-query';
import { fetchAnnouncements, AnnouncementQueryParams } from '@/queries/fetchAnnouncements';
import { logger } from '@sentry/nextjs';

export const useAnnouncements = (
    params: AnnouncementQueryParams = {},
    refetchInterval?: number
) => {
    // const params = new URLSearchParams({ published: published.toString() });
    
    const query = useQuery({
        queryKey: ['announcements', params],
        queryFn: () => {
            logger.debug('Fetching announcements', params);
            return fetchAnnouncements(params);
        },
        refetchInterval
    })
    
    return { 
        announcements: query.data?.data ?? [],
        total: query.data?.total ?? 0,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
};