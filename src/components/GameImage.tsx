"use client"

import { useEffect } from "react";
import Image from "next/image";
import { useFetchImageUrl } from "@/hooks/useFetchImageUrl";

type GameImageProps = {
    src: string | null;
    system?: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

const GameImage: React.FC<GameImageProps> = ({ 
    src, 
    system, 
    alt, 
    width = 400, 
    height = 400,
    className, 
    onClick 
}) => {
    const fetchImageUrlMutation = useFetchImageUrl();
    const { mutate: fetchImageUrl } = fetchImageUrlMutation;

    // Fetch the image URL when the game data is available
    useEffect(() => {
        if (src && system) {
            fetchImageUrl({ imageStr: src, system });
          }
    }, [fetchImageUrl, src, system]);
      
    const imageUrl =
        fetchImageUrlMutation.isSuccess && fetchImageUrlMutation.data
            ? fetchImageUrlMutation.data
            : "/images/defaults/default_game.webp"; // Fallback image

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover ${className}`}
            onClick={onClick}
        />
    );
}

export default GameImage