import { getQueryClient } from "@/server/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import GamemasterGameDetail from "../_components/GamemasterGameDetail";

interface GameDetailPageProps {
    id: string;
}

export default async function GameDetailPage({ params }: { params: Promise<GameDetailPageProps> }) {
    const { id } = await params;
    const queryClient = getQueryClient();
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GamemasterGameDetail gameId={id} />
      </HydrationBoundary>
    );
  }