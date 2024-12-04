"use client"

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScheduledGamesCard from "@/components/ScheduledGamesCard/ScheduledGamesCard";
import { GMGameData, Player } from "@/lib/types/custom";
import useSession from "@/utils/supabase/use-session";
import GameRegistrantsCard from "@/components/GameRegistrantsCard/GameRegistrantsCard";
import SelectedGameCard from "@/components/SelectedGameCard/page";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

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
      return players;
    default:
      toast.error("Error fetching players");
      return [];
  }
}

export default function GamemasterDashboard(): React.ReactElement {
  const queryClient = useQueryClient();
  const session = useSession();
  const user: User = (session?.user as User) ?? null;

  const [selectedGame, setSelectedGame] = useState<GMGameData | null>(null);
  const gamemasterId = user?.id;

  const { data: games, isLoading } = useQuery<GMGameData[], Error>({
    queryKey: ['games', gamemasterId, 'gm', 'full'],
    queryFn: () => fetchGames(gamemasterId),
    initialData: [],
    enabled: !!gamemasterId,
  });

  const { data: players } = useQuery<Player[], Error>({
    queryKey: ['players', user?.id as string, selectedGame?.id],
    queryFn: () => fetchPlayers(selectedGame?.id as string),
    initialData: [],
    enabled: !!selectedGame?.id,
  });
  
  const gameMutation = useMutation({
    mutationFn: () => fetchGames(gamemasterId),
    onSuccess: (updatedData) => {
      console.log('Games updated', updatedData);
      // Invalidate the `games` query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['games', gamemasterId, 'gm', 'full'] });      
    }
  })

  const playersMutation = useMutation({
    mutationFn: () => fetchPlayers(selectedGame?.id as string),
    onSuccess: () => {
      console.log('Players updated');
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

  const handleGameAdded = () => {
    gameMutation.mutate();
  };

  // const handleGameDeleted = () => {
  //   fetchGames();
  // };

  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (isLoading) return <div>Loading Gamemaster Games...</div>;
  if (!games) return <div>No Scheduled Gamemaster games found.</div>;

  return (
    <section className="items-center justify-center">
      <div className="space-y-2 p-2">
        <ScheduledGamesCard onGameAdded={handleGameAdded} onShowDetails={onShowDetails} onGameEdit={onGameEdit} scheduledGames={games} gamemaster_id={gamemasterId} />        
      </div>
      {/* <div className="flex flex-wrap space-y-4 border-4 border-green-500 p-2"> */}
      <div className="grid grid-cols-1  sm:grid-cols-4 gap-2  p-2">
        <div className="sm:col-span-1 bg-white shadow-md rounded-lg p-2">
          <SelectedGameCard game={selectedGame} />
        </div>
        <div className="sm:col-span-3 bg-white shadow-md rounded-lg p-4">
          <GameRegistrantsCard registrants={players} />
        </div>
      </div>
    </section>
  );
}