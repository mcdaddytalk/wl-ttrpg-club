"use client"

import React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function ThemeProvider({
    children,
    ...props
}: Readonly<ThemeProviderProps>) {
    return (
        <NextThemeProvider {...props}>
            <TooltipProvider delayDuration={0}>
                <NuqsAdapter>
                    {children}
                </NuqsAdapter>
            </TooltipProvider>
        </NextThemeProvider>
    );
}