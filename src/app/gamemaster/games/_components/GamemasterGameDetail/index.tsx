"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameDetails } from "@/hooks/gamemaster/useGamemasterGames";

interface Props {
  gameId: string;
}

export default function GamemasterGameDetailClient({ gameId }: Props) {
  const { data: game, isLoading } = useGameDetails(gameId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Game Details</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !game ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{game.title}</h2>
            <p className="text-sm text-muted-foreground">{game.system}</p>
            <p className="text-sm">{game.description}</p>
            <p className="text-sm">
              Players: {game.starting_seats}/{game.max_seats} • Status: {game.status} • Visibility: {game.visibility}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
