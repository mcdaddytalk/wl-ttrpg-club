import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'; // Shadcn Card
import { GMGameData } from '@/lib/types/custom';
import { format } from 'date-fns';

type GameListProps = {
  games: GMGameData[];}

const GameList = ({ games }: GameListProps): React.ReactElement => {
  if (games.length === 0) {
    return <p>No games found. Create your first game!</p>;
  }

  return (
    <div className="space-y-4">
      {games.map((game) => {
        const nextGameDate = game.scheduled_for ? format(new Date(game.scheduled_for), 'MMM dd, yyyy at h:mm a') : 'N/A';
        return (
        <Card key={game.id}>
          <CardHeader>
            <CardTitle>{game.title}</CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>System: {game.system}</p>
            <p>Seats: {game.seats}/{game.maxSeats}</p>
            <p>Next Game Date: {nextGameDate}</p>
          </CardContent>
        </Card>
      )})}
    </div>
  );
};

export default GameList;