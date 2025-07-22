import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GameData } from "@/lib/types/custom";
import { LuCalendar, LuUsers } from "react-icons/lu";
// import { TiStopwatch } from "react-icons/ti";
import { MdOutlineEventRepeat } from "react-icons/md";

import { redirect } from "next/navigation";
import GameImage from "@/components/GameImage";
import { formatDate } from "@/utils/helpers";



type GameCarouselCardProps = {
    game: GameData;
    onToggleFavorite: (gameId: string, currentFavorite: boolean) => void;
    className: string;
}


const GameCarouselCard = ({ game, onToggleFavorite, className }: GameCarouselCardProps): React.ReactElement => {

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
                onClick={() => {
                    redirect(`/games/adventure/${game.game_id}`)
                }}
                className={`cursor-pointer border hover:shadow-lg transition p-2`}
                >
                <CardHeader className="p-0">
                    <GameImage 
                        src={game.coverImage} 
                        alt={game.title}
                        system={game.system} 
                        width={400} 
                        height={200} 
                        className="w-full h-auto" 
                    />
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

                            {/* GM Badge */}
                            {game.isGM && (
                                <Badge 
                                    key={`gm-${game.id}`} 
                                    className="top-2 right-10"
                                >
                                    Gamemaster
                                </Badge>
                            )}

                            {/* Pending Approval Badge */}
                            {game.pending &&(
                                <Badge 
                                    key={`pending-${game.id}`} 
                                    className="top-2 right-10"
                                >
                                    Pending Approval
                                </Badge>
                            )}
                            {/* Registered Badge */}
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
                                    <span>{formatDate(game.nextGameDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Icon and Text on the Same Line */}
                                    <LuUsers />
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