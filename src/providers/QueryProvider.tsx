"use client"

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useQueryClient } from "@/hooks/useQueryClient";

export default function QueryProviderWrapper({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    )
}