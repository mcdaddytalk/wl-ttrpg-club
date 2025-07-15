import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdventurePageDetails } from "./AdventureDetailsPage";
import { Suspense } from "react";
import { getUser } from "@/server/authActions";
import { redirect } from "next/navigation";
import GameSkeleton from "@/components/GameSkeleton";
import { getQueryClient } from "@/server/getQueryClient";


interface AdventurePageParams {
    game_id: string;
}

const AdventurePage = async ({ params }: { params: Promise<AdventurePageParams> }) => {
    const { game_id } = await params;
    const queryClient = getQueryClient();
    const user = await getUser();
    if (!user) {
        redirect('/unauthorized');
    }
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <section className="flex flex-col">
                <Suspense fallback={<GameSkeleton />}>
                    <AdventurePageDetails game_id={game_id} />
                </Suspense>
            </section>
        </HydrationBoundary>
    )
}

export default AdventurePage