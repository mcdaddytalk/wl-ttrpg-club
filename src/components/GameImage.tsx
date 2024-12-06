"use client"

import { useFetchImageUrl } from "@/hooks/useFetchImageUrl";
import { GameData } from "@/lib/types/custom";
import Image from "next/image";
import React, { useEffect } from "react";

type GameImageProps = {
    game: GameData;
}

const GameImage = ({ game }: GameImageProps): React.ReactElement => {
    const fetchImageUrlMutation = useFetchImageUrl();
    const { mutate: fetchImageUrl } = fetchImageUrlMutation;
  
    // Fetch the image URL when the game data is available
    useEffect(() => {
      if (game.image) {
        fetchImageUrl({ imageStr: game.image, system: game.system });
      }
    }, [fetchImageUrl, game.image, game.system]);
  
    const imageUrl =
      fetchImageUrlMutation.isSuccess && fetchImageUrlMutation.data
        ? fetchImageUrlMutation.data
        : "/images/defaults/default_game.webp"; // Fallback image
  
    return (
      <Image
        src={imageUrl}
        alt={game.title}
        width={0}
        height={0}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover w-full h-auto rounded-md"
      />
    );
  };
  
  export default GameImage;