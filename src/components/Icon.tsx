"use client"

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface IconProps {
    type: "nextjs" | "vercel";
    className?: string;
    size?: number;
}

const Icon: React.FC<IconProps> = ({ type, className, size }) => {
    const { theme } = useTheme();

    const iconClasses = clsx(
        "height-auto width-auto",
        className
      );

    const iconSrc = {
        nextjs: theme === "dark" ? "/icons/nextjs-icon-dark-background.svg" : "/icons/nextjs-icon-light-background.svg",
        vercel: theme === "dark" ? "/icons/vercel-icon-dark.svg" : "/icons/vercel-icon-light.svg",
      };

    return (
        <Image
            src={iconSrc[type]}
            alt={`${type === "nextjs" ? "Next.js" : "Vercel"} logo`}
            width={size ?? 100}
            height={size ?? 100}
            className={iconClasses}
        />    
    )
}

export default Icon