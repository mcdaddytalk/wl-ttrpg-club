// components/GameDetails.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameData } from "@/lib/types/custom";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

interface GameDetailsProps {
    game: GameData | null;
}
export default function GameDetails({ game }: GameDetailsProps): React.ReactElement {
    if (!game) return <div className="text-gray-500">Select a game to view details</div>;

    const seatsAvailable = (game: GameData) => {
        if (game.currentSeats === null) return "N/A";
        if (game.maxSeats === null) return "N/A";
        if (game.maxSeats - game.currentSeats === 0) return "Full";
        return `${game.currentSeats} / ${game.maxSeats}`;
    };

    return ( game 
        ?
        <div className="flex gap-4">
        <Card className="flex-1 p-4">
            <CardHeader>
                <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{game.description}</p>
                <Separator className="thickness-[1px]" />
                <p>System: {game.system}</p>
                <p className="mt-4">Gamemaster: {game.gm_given_name} {game.gm_surname}</p>
                <p>Schedule: {game.interval}</p>
                <p>
                    First game started on {new Date(game.firstGameDate).toLocaleDateString()} @{' '}
                    {new Date(game.firstGameDate).toLocaleTimeString(
                        'en-US',
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                        }
                    )}
                </p>
                <p>
                    Next game scheduled for {new Date(game.nextGameDate).toLocaleDateString()} @{' '}
                    {new Date(game.nextGameDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                <p>Location: {game.location}</p>
                <p>Status: {game.status}</p>
                <p>Seats Available: {seatsAvailable(game)}</p>
            </CardContent>
        </Card>
        <div className="flex flex-col gap-2">
            <Button
                disabled={seatsAvailable(game) === "Full"}
                onClick={(e) => {
                    e.preventDefault();
                    toast.success("Game added to your Calendar");
                }}
            >
                {seatsAvailable(game) === "Full" ? "Full" : "Add Game"}
            </Button>
            <Button
                onClick={(e) => {
                    e.preventDefault(); 
                    toast.success("Message sent to Gamemaster")
                }}
            >
                Message Gamemaster
            </Button>
        </div>
        </div>
        :
        <div className="text-gray-500">Select a game to view details</div>
    );
}
