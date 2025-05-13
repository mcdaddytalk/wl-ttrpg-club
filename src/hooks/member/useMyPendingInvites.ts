'use client'

import { useQuery } from '@tanstack/react-query'
import { InviteDO } from '@/lib/types/data-objects'
import fetcher from '@/utils/fetcher'

interface Props {
    summarize?: boolean
}

export function useMyPendingInvites({ summarize }: Props = {}) {
  const queryKey = ['member', 'pending-invites', { summarize }];
  return useQuery<InviteDO[]>({
    queryKey,
    queryFn: async () => {
        const params = summarize ? new URLSearchParams({ summarize: 'true' }) : undefined
        return await fetcher('/api/members/invites/pending', undefined, params)
    },
  })
}
