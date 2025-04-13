import { GMGameSummaryDO } from "@/lib/types/custom";
import Link from "next/link";

export function GameSummaryList({ games }: { games: GMGameSummaryDO[] }) {
  return (
    <div className="grid gap-3">
      {games.map((game) => (
        <Link
          key={game.id}
          href={`/gamemaster/games/${game.id}`}
          className="border p-4 rounded hover:shadow transition bg-muted"
        >
          <h3 className="text-lg font-semibold">{game.title}</h3>
          <p className="text-sm text-muted-foreground">
            {game.system} • {game.playerCount}/{game.playerLimit} players • {game.status}
          </p>
        </Link>
      ))}
    </div>
  );
}
