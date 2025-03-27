"use client"

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useQueryClient } from "@/hooks/useQueryClient";
import { ENVS } from "@/utils/constants/envs"

export default function QueryProviderWrapper({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {ENVS.IS_DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    )
}