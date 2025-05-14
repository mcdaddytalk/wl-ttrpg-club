'use client'

import { useMyUpcomingGames } from "@/hooks/member/useMyUpcomingGames"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Gamepad2 } from "lucide-react"

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
        {games.slice(0, 3).map((game) => (
          <Link key={game.id} href={`/games/adventure/${game.id}`}>
            <div className="group border rounded-md p-4 hover:bg-muted transition flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg group-hover:underline">{game.title}</h3>
                {game.status && (
                  <span className="text-xs px-2 py-1 bg-muted-foreground/10 rounded-full text-muted-foreground capitalize">
                    {game.status}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {game.next_session_date
                  ? new Date(game.next_session_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
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
        ))}
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
