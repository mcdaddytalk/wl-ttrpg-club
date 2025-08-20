"use client"

import { useEffect } from "react";
import Image from "next/image";
import { useFetchImageUrl } from "@/hooks/useFetchImageUrl";
import { cn } from "@/lib/utils";

type GameImageVariant = "default" | "small" | "banner";

type GameImageProps = {
    src: string | null;
    system?: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
    variant?: GameImageVariant;
    highPriority?: boolean;
    blurDataURL?: string;
}

const FALLBACK = "/images/defaults/default_game.webp";

const VARIANT_BASE = "object-cover rounded-md shadow";

const VARIANT_SIZES: Record<GameImageVariant, string> = {
  default: "",          // controlled by width/height props
  small: "w-12 h-12",   // square thumb
  // banner handled by aspect wrapper, so we don't set h/w directly here
  banner: "w-full",     
};

const GameImage: React.FC<GameImageProps> = ({ 
    src, 
    system, 
    alt, 
    width = 400, 
    height = 400,
    className, 
    onClick,
    variant = 'default',
    highPriority = false,
    blurDataURL
}) => {
    const fetchImageUrlMutation = useFetchImageUrl();
    const { mutate: fetchImageUrl, data, isSuccess } = fetchImageUrlMutation;

    // Fetch the image URL when the game data is available
    useEffect(() => {
        if (src && system) {
            fetchImageUrl({ imageStr: src, system });
          }
    }, [fetchImageUrl, src, system]);
      
    const imageUrl = isSuccess && data ? data : FALLBACK;

    // For non-banner sizes, keep both width/height in sync with CSS:
    // - "small" has both w/h set (square), no warning.
    // - "default" relies on props (width & height), don’t override with CSS sizes.
    // - "banner" uses a ratio wrapper + fill (no warning).
    const commonClasses = cn(VARIANT_BASE, VARIANT_SIZES[variant], className);

    const priority = variant === "banner" ? true : highPriority;
        
    if (variant === "banner") {
    // Aspect wrapper: avoids width/height distortion warnings and keeps layout stable
    // Tweak ratios as you like (e.g., md:aspect-[5/2], lg:aspect-[16/5])
        return (
        <div className="relative w-full aspect-[16/5] md:aspect-[5/2] lg:aspect-[16/5]">
            <Image
                src={imageUrl}
                alt={alt}
                fill
                sizes="100vw"
                priority={priority}
                className={cn("object-cover rounded-md shadow", className)}
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL}
                onClick={onClick as any}
            />
        </div>
        );
    }

    const variantClasses = variant === "small" ? "w-12 h-12" : variant === "banner" ? "w-full h-[180px] md:h-[240px] lg:h-[320px]" : "";

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={variant === "small" ? 48 : width}
            height={variant === "small" ? 48 : height}
            priority={priority}
            sizes={
                variant === "small"
                ? "48px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            className={commonClasses}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            onClick={onClick}
        />
    );
}

export default GameImage