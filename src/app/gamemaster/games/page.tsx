"use client"

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScheduledGamesCard from "@/app/gamemaster/_components/ScheduledGamesCard/ScheduledGamesCard";
import { ContactListDO, GMGameData, Player, Location, MemberDO } from "@/lib/types/custom";
import useSession from "@/utils/supabase/use-session";
import GameRegistrantsCard from "@/app/gamemaster/_components/GameRegistrantsCard/GameRegistrantsCard";
import SelectedGameCard from "@/app/gamemaster/_components/SelectedGameCard/page";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import logger from "@/utils/logger";

async function fetchGames(gamemasterId: string): Promise<GMGameData[]> {
  const response = await fetch(`/api/gamemaster/${gamemasterId}/games`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  switch (response.status) {
    case 500:
      toast.error("Error fetching games");
      return [];   
    case 404:
      toast.error("Games not found");
      return [];
    case 200:
      const games = await response.json();
      return games;
    default:
      toast.error("Error fetching games");
      return [];
  }
};

const fetchMembers = async (): Promise<MemberDO[]> => {
  const response = await fetch(`/api/members`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch members');
  const data = await response.json();
  return data as MemberDO[]
}

const fetchPlayers = async (gameId: string): Promise<Player[]> => {
  const response = await fetch(`/api/games/${gameId}/registrants`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  switch (response.status) {
    case 500:
      toast.error("Error fetching players");
      return [];   
    case 404:
      toast.error("Players not found");
      return [];
    case 200:
      const players = await response.json();
      return players as Player[] || [];
    default:
      toast.error("Error fetching players");
      return [];
  }
}

const fetchGamemasters = async (): Promise<MemberDO[]> => {
  const response = await fetch(`/api/members/gamemasters`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch gamemasters');
  const data = await response.json();
  return data as MemberDO[]
}

const fetchLocations = async (): Promise<Location[]> => {
  const response = await fetch(`/api/locations`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  switch (response.status) {
    case 500:
      toast.error("Error fetching locations");
      return [];   
    case 404:
      toast.error("Locations not found");
      return [];
    case 200:
      const locations = await response.json();
      return locations as Location[] || [];
    default:
      toast.error("Error fetching locations");
      return [];
  }
}

export default function GamemasterDashboard(): React.ReactElement {
  const queryClient = useQueryClient();
  const session = useSession();
  const user: User = (session?.user as User) ?? null;

  const [selectedGame, setSelectedGame] = useState<GMGameData | null>(null);
  const gamemasterId = user?.id;

  const contactList = queryClient.getQueryData<ContactListDO[]>(['members', 'full']) || [];
  
  const { data: members }  = useQuery<MemberDO[], Error>({
    queryKey: ['members', 'full'],
    queryFn: () => fetchMembers(),
    enabled: !!gamemasterId,
  });

  const { data: games, isLoading } = useQuery<GMGameData[], Error>({
    queryKey: ['games', gamemasterId, 'gm', 'full'],
    queryFn: () => fetchGames(gamemasterId),
    enabled: !!gamemasterId,
  });

  const { data: players } = useQuery<Player[], Error>({
    queryKey: ['players', user?.id as string, selectedGame?.id],
    queryFn: () => fetchPlayers(selectedGame?.id as string),
    enabled: !!selectedGame?.id,
  });

  const { data: gamemasters } = useQuery<MemberDO[], Error>({
    queryKey: ['gamemasters', 'full'],
    queryFn: () => fetchGamemasters(),
    enabled: true,
  });

  const { data: locations } = useQuery<Location[], Error>({
    queryKey: ['locations', 'full'],
    queryFn: () => fetchLocations(),
    enabled: true,
  });
  
  const gameMutation = useMutation({
    mutationFn: () => fetchGames(gamemasterId),
    onSuccess: (updatedData) => {
      logger.debug('Games updated', updatedData);
      // Invalidate the `games` query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['games', gamemasterId, 'gm', 'full'] });      
    }
  })

  const playersMutation = useMutation({
    mutationFn: () => fetchPlayers(selectedGame?.id as string),
    onSuccess: () => {
    // logger.log('Players updated');
      // Invalidate the `players` query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['players', user?.id, selectedGame?.id] });
    }
  })
  
  const onShowDetails = (game: GMGameData) => {
    setSelectedGame(game);
    playersMutation.mutate();
  };

  const onGameEdit = () => {
    gameMutation.mutate();
  };

  const onGameDelete = (id: string) => {
    const response = fetch(`/api/gamemaster/${gamemasterId}/games`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    response.then((res) => {
      if (res.status === 200) {
        toast.success("Game deleted successfully");
        gameMutation.mutate();
      } else {
        toast.error("Failed to delete game");
      }
    });
  }

  const handleGameAdded = () => {
    gameMutation.mutate();
  };

  // logger.info(gamemasters)

  if (!user) return <div>Please log in to access the dashboard.</div>;
  
  return (
    <section className="items-center justify-center">
      <div className="space-y-2 p-2">
        {isLoading ? (
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
