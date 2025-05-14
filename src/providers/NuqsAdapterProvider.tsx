"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function NuqsAdapterProvider({ children }: { children: React.ReactNode }) {
    
    return (
        <NuqsAdapter>
            {children}
        </NuqsAdapter>
    )
}