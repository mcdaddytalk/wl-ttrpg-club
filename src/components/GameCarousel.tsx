"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameData } from "@/lib/types/custom";
import { Separator } from "./ui/separator";

interface GameCarouselProps {
    games: GameData[];
    onSelectGame: (game: GameData) => void;
    onToggleFavorite: (gameId: string, currentFavorite: boolean) => void;
}

export default function GameCarousel({ games, onSelectGame, onToggleFavorite }: GameCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const handleNext = () => {
        if (currentIndex + 3 < games.length) setCurrentIndex(currentIndex + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const visibleGames = games.slice(currentIndex, currentIndex + 3);

    const seatsAvailable = (game: GameData) => {
        if (game.currentSeats === null) return "N/A";
        if (game.maxSeats === null) return "N/A";
        if (game.maxSeats - game.currentSeats === 0) return "Full";
        return `${game.currentSeats} / ${game.maxSeats}`;
    };

    return (
        <div className="relative flex items-center">
          <Button className="absolute left-0" onClick={handlePrev} disabled={currentIndex === 0}>
            ←
          </Button>
          <div className="flex gap-4 overflow-hidden">
            {visibleGames.map((game) => (
              <Card
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="cursor-pointer border hover:shadow-lg transition"
              >
                <CardHeader>
                    <CardTitle className="text-lg">{game.title}</CardTitle>
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

                            {game.registered && <Badge 
                                key={`registered-${game.id}`} 
                                className="top-2 right-10">
                                    Registered
                                </Badge>}
                    </div>                    
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <Separator />
                        <div className="flex flex-col">
                            <div className="text-sm">
                                <p>Gamemaster: {game.gm_given_name} {game.gm_surname}</p>
                                <p>Schedule: {game.interval}</p>
                                <p>System: {game.system}</p>
                                <p>Seats Available: {seatsAvailable(game)}</p>
                            </div>
                            <Separator />
                            <div className="text-md mt-2">
                                <p>{game.description}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="absolute right-0" onClick={handleNext} disabled={currentIndex + 3 >= games.length}>
            →
          </Button>
        </div>
      );
}
