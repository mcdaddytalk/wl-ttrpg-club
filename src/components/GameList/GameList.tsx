import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'; // Shadcn Card
import { GMGameDO } from '@/lib/types/data-objects';
import { format } from 'date-fns';

type GameListProps = {
  games: GMGameDO[] | null;}

const GameList = ({ games }: GameListProps): React.ReactElement => {
  if (!games || games.length === 0) {
    return <p>No games found. Create your first game!</p>;
  }

  return (
    <div className="space-y-4">
      {games.map((game) => {
        const nextGameDate = game.scheduled_next ? format(new Date(game.scheduled_next), 'MMM dd, yyyy @ h:mm a') : 'N/A';
        return (
        <Card key={game.id}>
          <CardHeader>
            <CardTitle>{game.title}</CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>System: {game.system}</p>
            <p>Seats: {game.registered}/{game.maxSeats}</p>
            <p>Next Game Date: {nextGameDate}</p>
          </CardContent>
        </Card>
      )})}
    </div>
  );
};

export default GameList;