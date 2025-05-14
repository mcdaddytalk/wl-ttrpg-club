'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchAllGameSchedules } from "@/hooks/gamemaster/useGamemasterGameSchedules"
import { formatDate, locationBadge, statusBadge } from "@/utils/helpers"
import Link from "next/link"

export function GMUpcomingGamesPreview() {
  const { data, isLoading, isError } = useFetchAllGameSchedules()

  if (isLoading) return <Skeleton className="h-[180px] w-full" />
  if (isError || !data) return <p className="text-muted-foreground text-sm">Failed to load upcoming games.</p>

  const upcoming = data
    .filter((g) => !!g.next_game_date)
    .sort((a, b) => (a.next_game_date ?? '').localeCompare(b.next_game_date ?? ''))
    .slice(0, 3)

  if (upcoming.length === 0) {
    return <p className="text-muted-foreground text-sm">No upcoming games scheduled.</p>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl">Upcoming Games</CardTitle>
        <Button asChild size="sm" variant="ghost">
          <Link href="/gamemaster/schedule">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {upcoming.map((schedule) => (
          <div key={schedule.game_id} className="border rounded-lg p-4 hover:bg-muted/30 transition">
            <Link href={`/games/adventure/${schedule.game_id}`} className="font-semibold hover:underline block">
              {schedule.game_title}
            </Link>
            <p className="text-sm text-muted-foreground">
              Next: {schedule.next_game_date ? formatDate(schedule.next_game_date) : 'TBD'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{schedule.interval}</Badge>
              <Badge className={statusBadge(schedule.schedule_status)}>{schedule.schedule_status}</Badge>
              {schedule.location && (
                <Badge className={locationBadge(schedule.location.type)}>
                  {schedule.location.name} ({schedule.location.type})
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
