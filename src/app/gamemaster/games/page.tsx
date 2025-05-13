"use client"

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ScheduledGamesCard from "@/app/gamemaster/_components/ScheduledGamesCard/ScheduledGamesCard";
import { ContactListDO, GMGameDO, MemberDO } from "@/lib/types/data-objects";
import useSession from "@/utils/supabase/use-session";
import GameRegistrantsCard from "@/app/gamemaster/_components/GameRegistrantsCard/GameRegistrantsCard";
import SelectedGameCard from "@/app/gamemaster/_components/SelectedGameCard/page";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { useDeleteGame, useGamemasterGamesFull, useRefreshGames } from "@/hooks/gamemaster/useGamemasterGames";
import { useGameMembers, useGameRegistrants, useRefreshRegistrants } from "@/hooks/gamemaster/useGamemasterPlayers";
import { useGamemasterLocations } from "@/hooks/gamemaster/useGamemasterLocations";

export default function GamemasterDashboard(): React.ReactElement {
  const queryClient = useQueryClient();
  const session = useSession();
  const user: User = (session?.user as User) ?? null;

  const [selectedGame, setSelectedGame] = useState<GMGameDO | null>(null);
  const gamemasterId = user?.id;

  const contactList = queryClient.getQueryData<ContactListDO[]>(['members', 'full']) || [];

  const { members } = useGameMembers();
  const { games, isLoading: isGamesLoading } = useGamemasterGamesFull();
  const { data: players } = useGameRegistrants(selectedGame?.id ?? "");
  const { locations } = useGamemasterLocations();
  const gamemasters = queryClient.getQueryData<MemberDO[]>(['gamemasters', 'full']) || [];

  const { mutate: refreshGames } = useRefreshGames();
  const { mutate: refreshRegistrants } = useRefreshRegistrants();
  const { mutate: deleteGame } = useDeleteGame(gamemasterId);
 
  
  const onShowDetails = (game: GMGameDO) => {
    setSelectedGame(game);
    refreshRegistrants(game.id); // ✅ Now passes the correct id at runtime
  };

  const onGameEdit = () => {
    refreshGames();
  };

  const onGameDelete = (id: string) => {
    deleteGame(id, {
      onSuccess: () => {
        toast.success("Game deleted successfully");
        refreshGames();
      },
      onError: () => {
        toast.error("Failed to delete game");
      },
    })
  }

  const handleGameAdded = () => {
    refreshGames();
  };

  // logger.info(gamemasters)

  if (!user) return <div>Please log in to access the dashboard.</div>;
  
  return (
    <section className="items-center justify-center">
      <div className="space-y-2 p-2">
        {isGamesLoading ? (
          <DataTableSkeleton 
                      columnCount={5}
                      searchableColumnCount={3}
                      filterableColumnCount={5}
                      cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                      shrinkZero
                    />
        ): (
          <ScheduledGamesCard 
            onGameAdded={handleGameAdded} 
            onShowDetails={onShowDetails} 
            onGameEdit={onGameEdit}
            onGameDelete={onGameDelete} 
            scheduledGames={games || []} 
            gamemaster_id={gamemasterId}
            gamemasters={gamemasters || []}
            members={members || []} 
            locations={locations || []}
          />        
        )}
      </div>
      {/* <div className="flex flex-wrap space-y-4 border-4 border-green-500 p-2"> */}
      {selectedGame ? (
        <div className="grid grid-cols-1  sm:grid-cols-4 gap-2  p-2">
          <div className="sm:col-span-1 bg-white shadow-md rounded-lg p-2">
            <SelectedGameCard game={selectedGame} />
          </div>
          <div className="sm:col-span-3 bg-white shadow-md rounded-lg p-4">
            <GameRegistrantsCard contactList={contactList} user={user} gameId={selectedGame.id} registrants={players || []} />
          </div>
        </div>
      ) : (
        <></>
      )}
      
    </section>
  );
}
