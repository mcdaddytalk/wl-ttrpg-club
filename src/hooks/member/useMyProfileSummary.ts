'use client'

import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils/fetcher'
import { ProfileSummaryDO } from '@/lib/types/data-objects'

export function useMyProfileSummary() {
  return useQuery<ProfileSummaryDO>({
    queryKey: ['member', 'profile-summary'],
    queryFn: async () => await fetcher('/api/members/profile/summary'),
  })
}
