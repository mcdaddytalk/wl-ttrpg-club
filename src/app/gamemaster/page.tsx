import { getQueryClient } from "@/server/getQueryClient";
import GamemasterDashboardPage from "./dashboard/page";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const GMPage = (): React.ReactElement => {
    const queryClient = getQueryClient();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
                <GamemasterDashboardPage />
            </Suspense>
        </HydrationBoundary>
    );
}

export default GMPage;