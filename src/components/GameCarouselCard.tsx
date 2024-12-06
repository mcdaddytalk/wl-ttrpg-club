import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "./ui/separator";
import { GameData } from "@/lib/types/custom";
import { LuCalendar, LuUsers2 } from "react-icons/lu";
// import { TiStopwatch } from "react-icons/ti";
import { MdOutlineEventRepeat } from "react-icons/md";
import GameImage from "./GameImage";



type GameCarouselCardProps = {
    game: GameData;
    onSelectGame: (game: GameData) => void;
    onToggleFavorite: (gameId: string, currentFavorite: boolean) => void;
    className: string;
}


const GameCarouselCard = ({ game, onSelectGame, onToggleFavorite, className }: GameCarouselCardProps): React.ReactElement => {

    const seatsAvailable = (game: GameData) => {
        if (game.currentSeats === null) return "N/A";
        if (game.maxSeats === null) return "N/A";
        if (game.maxSeats - game.currentSeats === 0) return "Full";
        return `${game.currentSeats} / ${game.maxSeats}`;
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <Card
                key={game.id}
                onClick={() => onSelectGame(game)}
                className={`cursor-pointer border hover:shadow-lg transition p-2`}
                >
                <CardHeader className="p-0">
                    <GameImage game={game} />
                    <div className="flex flex-row gap-2">
                            {/* Clickable Favorite Badge */}
                            <Badge
                                key={`favorite-${game.id}`} // Add a unique key for each badge based on game.id}
                                className="right-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent selecting the card when toggling favorite
                                    onToggleFavorite(game.game_id, game.favorite);
                                }}
                            >
                                {game.favorite ? "⭐ Favorite" : "☆ Add Favorite"}
                            </Badge>

                            {game.registered &&(
                                <Badge 
                                    key={`registered-${game.id}`} 
                                    className="top-2 right-10"
                                >
                                    Registered
                                </Badge>
                            )}
                    </div>                    
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                    <CardDescription className="text-sm">{game.system}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <Separator />
                        <div className="flex flex-col">
                            <div className="text-sm">
                                <div className="flex items-center gap-2">
                                    {/* Icon and Text on the Same Line */}
                                    <MdOutlineEventRepeat />
                                    <span>{game.interval} / {game.dayOfWeek}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Icon and Text on the Same Line */}
                                    <LuCalendar />
                                    <span>{new Date(game.nextGameDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Icon and Text on the Same Line */}
                                    <LuUsers2 />
                                    <span>{seatsAvailable(game)} Seats Filled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default GameCarouselCard;