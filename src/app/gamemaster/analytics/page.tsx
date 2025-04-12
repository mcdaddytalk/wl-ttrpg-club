import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import GamemasterAnalyticsDashboard from "./_components/GamemasterAnalyticsDashboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryClient } from "@/server/getQueryClient";

export default function GamemasterAnalyticsPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <GamemasterAnalyticsDashboard />
      </Suspense>
    </HydrationBoundary>
  );
}
