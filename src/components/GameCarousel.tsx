"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameData } from "@/lib/types/custom";
import GameCarouselCard from "./GameCarouselCard";

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

    // Card width including gap
    const cardWidthWithGap = 100 / 3; // 33.33% width for each card

    return (
        <div className="relative flex items-center">
          <Button 
            className="absolute left-0 z-10" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
          >
            ←
          </Button>
          <div className="flex gap-2 sm:gap-4 overflow-hidden w-full">
            <div className="flex transition-transform duration-300 ease-in-out "
              style={{ 
                transform: `translateX(-${currentIndex * (cardWidthWithGap + (2/3))}%)`, 
                width: `${games.length * (cardWidthWithGap + (2/3))}%` 
              }}
            >
            {games.map((game) => (
              <GameCarouselCard key={game.id} game={game} onSelectGame={onSelectGame} onToggleFavorite={onToggleFavorite} className="w-[calc(100% / 3)] pl-2 pr-2"/> 
            ))}
            </div>
          </div>
          <Button 
            className="absolute right-0 z-10" 
            onClick={handleNext} 
            disabled={currentIndex + 3 >= games.length}
          >
            →
          </Button>
        </div>
      );
}
