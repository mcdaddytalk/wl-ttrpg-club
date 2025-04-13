"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGamemasterGames } from "@/hooks/gamemaster/useGamemasterGames";
import { format } from "date-fns";

export function MyGamesCard() {
  const { games = [], isLoading } = useGamemasterGames();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Games</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading games...</p>
        ) : games.length === 0 ? (
          <p className="text-muted-foreground text-sm">You are not currently running any games.</p>
        ) : (
          <ul className="space-y-2">
            {games.slice(0, 5).map((game) => (
              <li key={game.id} className="flex justify-between items-start">
                <div>
                  <p className="font-medium leading-tight">{game.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {game.system} • {game.status} • {game.schedules?.next_game_date ? format(new Date(game.schedules.next_game_date), "PPP") : "No date"}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/gamemaster/games/${game.id}`}>Manage</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
        {games.length > 5 && (
          <div className="text-right mt-2">
            <Button size="sm" variant="link" asChild>
              <Link href="/gamemaster/games">View all</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
