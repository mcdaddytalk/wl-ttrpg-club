'use client'

import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils/fetcher'
import { MessageDO } from '@/lib/types/data-objects'

export function useMyRecentMessages() {
  return useQuery<MessageDO[]>({
    queryKey: ['member', 'recent-messages'],
    queryFn: async () => await fetcher('/api/members/messages/recent'),
  })
}
