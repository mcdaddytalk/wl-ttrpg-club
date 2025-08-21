import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchAnnouncements, AnnouncementQueryParams } from '@/queries/fetchAnnouncements';
import logger from '@/utils/logger';
import { useQueryClient } from './useQueryClient';
import { AnnouncementDO } from '@/lib/types/data-objects';
import fetcher from '@/utils/fetcher';

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

export const useSaveAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (announcement: Partial<AnnouncementDO>) => {
            const method = announcement.id ? 'PATCH' : 'POST';
            const endpoint = announcement.id 
                ? `/api/announcements/${announcement.id}` 
                : '/api/announcements';
            
            return fetcher<AnnouncementDO>(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(announcement),
            })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
    });
}

export const useDeleteAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (announcementId: string) => {
            const res = await fetch(`/api/announcements/${announcementId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete announcement');
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
    });
}

export const useBulkDeleteAnnouncements = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (announcementIds: string[]) => {
            if (!announcementIds?.length) return { deleteCount: 0 };

            await Promise.all(
                announcementIds.map((id) => 
                    fetcher(`/api/announcements/${id}`, { method: 'DELETE' })
            ));
            return { deleteCount: announcementIds.length };            
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
    });
}