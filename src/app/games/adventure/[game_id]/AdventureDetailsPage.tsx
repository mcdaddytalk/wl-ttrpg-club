"use client"

import React from "react";
import { Slash } from "lucide-react";
// import { GameData, GameFavorite, GameRegistration } from "@/lib/types/custom";
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
// import { useQueryClient } from "@/hooks/useQueryClient";
// import { useQuery } from "@tanstack/react-query";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import logger from "@/utils/logger";
import { useGameDetails } from "@/hooks/member/useGameDetails";

type AdventureDetailsPageProps = {
    game_id: string
}

export const AdventurePageDetails = ({ game_id }: AdventureDetailsPageProps): React.ReactElement => {
    const session = useSession();
    const user: User = (session?.user as User) ?? {};

    const { data: game, isError, error } = useGameDetails(game_id, user.id);

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