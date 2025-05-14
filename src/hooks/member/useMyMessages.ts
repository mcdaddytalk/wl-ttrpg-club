import { useMutation, useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@/hooks/useQueryClient";
import { fetchMessages } from "@/queries/fetchMessages";
import { MessageDO } from "@/lib/types/data-objects";
import fetcher from "@/utils/fetcher";
import { toast } from "sonner";


export const useFetchMyMessages = (userId: string) => {
    return useQuery<MessageDO[]>({
        queryKey: ['messages', 'all',   userId],
        queryFn: async () => fetchMessages(userId, 'all'),
        enabled: !!userId
    })
}

export const useMarkMyMessagesAsRead = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ messageId, isRead }: { messageId: string, isRead: boolean }) => {
            return fetcher<MessageDO>(`/api/messages/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    is_read: !isRead
                }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'all', userId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', userId] });
        },
        onError: () => {
            toast.error("Failed to mark message as read.");
        }
    })
}

export const useMarkMyMessagesAsArchived = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ messageId, isArchived, isRead }: { messageId: string, isArchived: boolean, isRead: boolean }) => {
            return fetcher<MessageDO>(`/api/messages/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    is_archived: !isArchived,
                    is_read: !isRead
                }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'all', userId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', userId] });
        },
        onError: () => {
            toast.error("Failed to mark message as archived.");
        }
    })
}

export const useMarkAllMyMessagesAsRead = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (selectedMessages: MessageDO[]) => {
            return fetcher<MessageDO[]>(`/api/messages`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, is_read: true, selectedMessages }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'all', userId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', userId] });
        },
        onError: () => {
            toast.error("Failed to mark all messages as read.");
        }
    })
}

export const useMarkAllMyMessagesAsArchived = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (selectedMessages: MessageDO[]) => {
            return fetcher<MessageDO[]>(`/api/messages`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, selectedMessages }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'all', userId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', userId] });
        },
        onError: () => {
            toast.error("Failed to mark all messages as archived.");
        }
    })
}
