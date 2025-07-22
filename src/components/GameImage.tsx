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
    variant?: "default" | "small" | "banner";
}

const GameImage: React.FC<GameImageProps> = ({ 
    src, 
    system, 
    alt, 
    width = 400, 
    height = 400,
    className, 
    onClick,
    variant = 'default' 
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

    const variantClasses = variant === "small" ? "w-12 h-12" : variant === "banner" ? "w-full h-[180px] md:h-[240px] lg:h-[320px]" : "";

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover rounded-md shadow ${variantClasses} ${className}`}
            onClick={onClick}
        />
    );
}

export default GameImage