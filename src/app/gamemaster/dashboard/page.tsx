import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GamemasterDashboardClient from "./_components/GamemasterDashboardClient";
import { getQueryClient } from "@/server/getQueryClient";

export default async function GamemasterDashboardPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <GamemasterDashboardClient />
    </HydrationBoundary>
  );
}