'use client'

import { useMyUpcomingGames } from "@/hooks/member/useMyUpcomingGames"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Gamepad2 } from "lucide-react"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import isToday from "dayjs/plugin/isToday"
import isTomorrow from "dayjs/plugin/isTomorrow"
import { ScheduleStatusBadge } from "./ScheduleStatusBadge"

dayjs.extend(weekday)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

export function UpcomingGamesPreview() {
  const { data: games, isLoading } = useMyUpcomingGames()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!games || games.length === 0) {
    return (
      <div className="border rounded-md p-6 text-center space-y-4 flex flex-col items-center">
        <Gamepad2 className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">No upcoming games scheduled yet.</p>
        <Button asChild variant="outline">
          <Link href="/member/my-games">Browse My Games</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {games.slice(0, 3)
          .map((game) => {
            
            const date = game.next_session_date ? dayjs(game.next_session_date) : null
            let hint: string | null = null

            if (date) {
              if (date.isToday()) hint = "Today!"
              else if (date.isTomorrow()) hint = "Tomorrow!"
              else if (date.isAfter(dayjs()) && date.diff(dayjs(), "day") <= 6) {
                hint = `Next ${date.format("dddd")}!`
              }
            }


            return (
              <Link key={game.id} href={`/games/adventure/${game.id}`}>
                <div className="group border rounded-md p-4 hover:bg-muted transition flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg group-hover:underline">{game.title}</h3>
                    {game.status && <ScheduleStatusBadge status={game.status} />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {date
                      ? `${date.format("MMM D, YYYY h:mm A")} ${hint ? `(${hint})` : ""}`
                      : "Date TBD"}
                  </div>
                  {game.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {game.location.name}
                    </div>
                  )}
                </div>
              </Link>
            )
          }
        )}
      </div>

      {/* View All Button */}
      <div className="flex justify-center pt-4">
        <Button asChild size="sm" variant="outline">
          <Link href="/member/my-games">
            View All Games
          </Link>
        </Button>
      </div>
    </div>
  )
}
