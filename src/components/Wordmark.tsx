"use client"

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface WorkmarkProps {
    type: "nextjs" | "vercel";
    className?: string;
    size?: number;
}

const Workmark: React.FC<WorkmarkProps> = ({ type, className, size }) => {
    const { theme } = useTheme();

    const workmarkClasses = clsx(
        "height-auto width-auto",
        className
      );

    const workmarkSrc = {
        nextjs: theme === "dark" ? "/nextjs-logotype-dark-background.svg" : "/nextjs-logotype-light-background.svg",
        vercel: theme === "dark" ? "/vercel-logotype-dark.svg" : "/vercel-logotype-light.svg",
      };

    return (
        <Image
            src={workmarkSrc[type]}
            alt={`${type === "nextjs" ? "Next.js" : "Vercel"} logo`}
            width={size ?? 100}
            height={size ?? 100}
            className={workmarkClasses}
        />    
    )
}

export default Workmark