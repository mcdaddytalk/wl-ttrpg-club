"use client"

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface IconProps {
    type: "nextjs" | "vercel";
    className?: string;
    enforceSquare?: boolean;
}

const Icon: React.FC<IconProps> = ({ type, className, enforceSquare = true }) => {
    const { theme } = useTheme();

    const iconSrc = {
        nextjs: theme === "dark" ? "/icons/nextjs-icon-dark-background.svg" : "/icons/nextjs-icon-light-background.svg",
        vercel: theme === "dark" ? "/icons/vercel-icon-dark.svg" : "/icons/vercel-icon-light.svg",
      };

      return (
        <div
          className={clsx(
            "relative",
            enforceSquare && "aspect-square",
            className
          )}
        >
          <Image
            src={iconSrc[type]}
            alt={`${type === "nextjs" ? "Next.js" : "Vercel"} logo`}
            fill
            sizes="100%"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      );
}

export default Icon