"use client"

import React from "react";
import { Slash } from "lucide-react";
import { GameData, GameFavorite, GameRegistration } from "@/lib/types/custom";
import { 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    // BreadcrumbPage,
    BreadcrumbList
} from "@/components/ui/breadcrumb";
import GameDetails from "@/components/GameDetails";
import { redirect } from "next/navigation";
import { useQueryClient } from "@/hooks/useQueryClient";
import { useQuery } from "@tanstack/react-query";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import logger from "@/utils/logger";

type AdventureDetailsPageProps = {
    game_id: string
}

export const AdventurePageDetails = ({ game_id }: AdventureDetailsPageProps): React.ReactElement => {
    const queryClient = useQueryClient();
    const session = useSession();
    const user: User = (session?.user as User) ?? {};

    const { data: game, isLoading, isError, error } = useQuery({
        queryKey: ['games', user?.id, game_id], 
        queryFn: async () => {
            const response = await fetch(`/api/games/${game_id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            ).then((res) => {
                if (!res.ok) {
                    throw new Error('Error fetching game');
                }
                return res.json() as Promise<GameData>;
            });
            response.favorite = response.favoritedBy.some((favorite: GameFavorite) => favorite.member_id === user?.id);
            response.registered = response.registrations.some((registrant: GameRegistration) => registrant.member_id === user?.id && registrant.status === 'approved');
            response.pending = response.registrations.some((registrant: GameRegistration) => registrant.member_id === user?.id && registrant.status === 'pending');
            queryClient.setQueryData(
                ['games', game_id, user?.id],
                response
            )
            return response;
        },
        enabled: !!user?.id
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        logger.error(error);
        redirect('/error')
    }

    if (!game) {
        return <div>Game not found</div>
    }

    return (
        <div className="flex flex-col">
                <Breadcrumb 
                    aria-label="Breadcrumb"
                >
                    <BreadcrumbList className="flex items-center mt-2 dark:text-slate-100 text-slate-400 hover:text-slate-200 ">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                        <Slash />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/games">Games</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <Slash />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            {game.title}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            
                <GameDetails user={user} game={game} />
        </div>
    )
}