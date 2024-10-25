"use client"

import React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export default function ThemeProvider({
    children,
    ...props
}: Readonly<ThemeProviderProps>) {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}