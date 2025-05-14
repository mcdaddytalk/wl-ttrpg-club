
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GameImage from "@/components/GameImage";
import { format } from 'date-fns';
import { GMGameDO } from "@/lib/types/data-objects";

interface SelectedGameCardProps {
    game: GMGameDO | null;
    children?: React.ReactNode;
    onClick?: () => void
}

const SelectedGameCard = ({ game, children, onClick }: SelectedGameCardProps): React.ReactElement => {
    let nextGameDate;
    if (game) {
        nextGameDate = game.scheduled_next ? format(new Date(game.scheduled_next), 'MMM dd, yyyy @ h:mm a') : 'N/A';
    }
    return (
        <Card className="shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
            <CardHeader>
                <CardTitle>{game ? game.title : "No game selected"}</CardTitle>
                <CardDescription>{game ? game.description || "No description" : "No game selected"}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {game && (
                    <>
                        <GameImage 
                            src={game.coverImage} 
                            alt={game.title}
                            system={game.system} 
                            width={400} 
                            height={200} 
                            className="rounded-lg object-cover cursor-pointer"
                        />
                        <p className="text-sm text-gray-500">Gamemaster: {game.gamemaster.profiles.given_name + " " + game.gamemaster.profiles.surname}</p>
                        {game.location && <p className="text-sm text-gray-500">Location: {game.location.name}</p>}
                        {game.scheduled_next && (
                            <div>
                                <p className="text-sm text-gray-500">System: {game.system}</p>
                                <p className="text-sm text-gray-500">Seats: {game.registered}/{game.maxSeats}</p>
                                <p className="text-sm text-gray-500">Next Game Date: {nextGameDate}</p>
                            </div>
                        )}                            
                    </>
                )}
                {children}
            </CardContent>
        </Card>
    )
}

export default SelectedGameCard;