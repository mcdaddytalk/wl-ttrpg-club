"use client"

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScheduledGamesCard from "@/components/ScheduledGamesCard/ScheduledGamesCard";
import { GameRegistration, GMGameData, Player } from "@/lib/types/custom";
import useSupabaseBrowserClient from "@/utils/supabase/client";
import useSession from "@/utils/supabase/use-session";
import GameRegistrantsCard from "@/components/GameRegistrantsCard/GameRegistrantsCard";
import SelectedGameCard from "@/components/SelectedGameCard/page";
import { SupabaseClient, User } from "@supabase/supabase-js";

async function fetchGames(supabase: SupabaseClient, gamemasterId: string): Promise<GMGameData[]> {
    const { data: gamesData, error: gamesError } = await supabase
      .from('games')
      .select(`
        id, 
        title, 
        description,
        system, 
        max_seats, 
        game_schedule(
          id,
          interval,
          day_of_week,
          first_game_date,
          next_game_date,
          last_game_date,
          status        
        )    
      `)
      .eq('gamemaster_id', gamemasterId);

    if (gamesError) {
      console.log(gamesError);
    } else {
      console.log(gamesData);
    }
    
    const gameIds = gamesData?.map((game) => game.id) ?? [];

    const { data: registrations, error: registrationsError } = await supabase
      .from('game_registrations')
      .select(`
        game_id,
        member_id
      `)
      //.eq('games.gamemaster_id', user.id);
      .in('game_id', gameIds);
    
    if (registrationsError) {
      console.error(registrationsError);
    } else {
      console.log(registrations);
    }

    const seatCounts = registrations?.reduce((acc, reg) => {
    const game = gamesData?.find((game) => game.id === reg.game_id);
      if (game) {
        acc[reg.game_id] = (acc[reg.game_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const combinedData: GMGameData[] = gamesData?.map(game => ({
      id: game.id,
      title: game.title,
      description: game.description,
      system: game.system,
      scheduled_next: game.game_schedule[0]?.next_game_date,
      interval: game.game_schedule[0]?.interval,
      dow: game.game_schedule[0]?.day_of_week,
      maxSeats: game.max_seats,
      status: game.game_schedule[0]?.status,
      registered: seatCounts![game.id] || 0,
    })) ?? [];
    // const combinedData = mockScheduledGames;

    return combinedData;
};

async function fetchPlayers (supabase: SupabaseClient, id: string): Promise<Player[]> {
  const { data: playersData, error: playersError } = await supabase
    .from('game_registrations')
    .select(`
      game_id,
      member_id,
      members(
        id,
        email,
        is_minor,
        profiles (
          given_name,
          surname,
          phone,
          experience_level,
          avatar
        )
      )        
    `)
    .eq('game_id', id)
    
  if (playersError) {
    console.error(playersError);
  } else {
    console.log(playersData);
  }

  const players: Player[] = (playersData as unknown as GameRegistration[])?.map((player) => {
    return {
      id: player.member_id,
      email: player.members.email,
      phoneNumber: player.members.profiles.phone,
      givenName: player.members.profiles.given_name ?? "",
      surname: player.members.profiles.surname ?? "",
      avatar: player.members.profiles.avatar,
      isMinor: player.members.is_minor,
      experienceLevel: player.members.profiles.experience_level,
    }
  }) ?? [];

  // const gameRegistrants = mockRegisteredPlayers;

  // const players = gameRegistrants
  //   .filter((registrant) => registrant.game_id === id)
  //   .map((registrant) => 
  //     mockPlayers.find((player) => player.id === registrant.member_id)
  //   ).filter((player): player is Player => !!player) ?? [];

  return players
};
  
  

export default function GamemasterDashboard(): React.ReactElement {
  const supabase = useSupabaseBrowserClient();
  const queryClient = useQueryClient();
  const session = useSession();
  const user: User = (session?.user as User) ?? null;

  const [selectedGame, setSelectedGame] = useState<GMGameData | null>(null);
  const gamemasterId = user?.id;

  const { data: games, isLoading } = useQuery<GMGameData[], Error>({
    queryKey: ['games', supabase, gamemasterId],
    queryFn: () => fetchGames(supabase, gamemasterId),
    enabled: !!gamemasterId,
  });

  const { data: players } = useQuery<Player[], Error>({
    queryKey: ['players', supabase, selectedGame?.id],
    queryFn: () => fetchPlayers(supabase, selectedGame?.id as string),
    initialData: [],
    enabled: !!selectedGame?.id,
  });
  
  const gameMutation = useMutation({
    mutationFn: () => fetchGames(supabase, gamemasterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games', gamemasterId] });
    }
  })

  const playersMutation = useMutation({
    mutationFn: () => fetchPlayers(supabase, selectedGame?.id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    }
  })
  
  const onSelectGame = (game: GMGameData) => {
    setSelectedGame(game);
    playersMutation.mutate();
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
        <ScheduledGamesCard onGameAdded={handleGameAdded} onSelectGame={onSelectGame} scheduledGames={games} gamemaster_id={gamemasterId} />        
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