'use client'

import { useQuery } from '@tanstack/react-query'

import { UpcomingGameDO } from '@/lib/types/data-objects'
import fetcher from '@/utils/fetcher'

export function useMyUpcomingGames() {
  return useQuery<UpcomingGameDO[]>({
    queryKey: ['member', 'upcoming-games'],
    queryFn: async () => await fetcher('/api/members/games/upcoming'),
  })
}
