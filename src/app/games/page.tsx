"use client"

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GameCarousel from "@/components/GameCarousel";
import GameDetails from "@/components/GameDetails";
import { GameData, SupaGameScheduleData } from "@/lib/types/custom";
import useSupabaseBrowserClient from "@/utils/supabase/client";
import useSession from "@/utils/supabase/use-session";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { useQueryClient } from "@/hooks/useQueryClient";
import { fetchRegistrants } from "@/queries/fetchRegistrants";

async function fetchGames(supabase: SupabaseClient, user: User): Promise<GameData[]> {
  const { data: gamesData, error: gamesError } = await supabase
      .from("game_schedule")
      .select(`
        id,
        game_id,
        status,
        interval,
        first_game_date,
        next_game_date,
        location,
        day_of_week,
        games (
          title,
          description,
          system,
          max_seats,
          members!fk_games_members (
            id,
            profiles (
              given_name,
              surname,
              avatar
            )
          )
        )        
      `)
      .eq("status", "scheduled")

    if (gamesError) throw gamesError
    // const gameIds = gamesData?.map((game) => game.id) ?? [];

    const { data: registrations, error: registrationsError } = await fetchRegistrants(supabase);
    console.log(registrations);
    if (registrationsError) throw registrationsError
    if (!registrations) throw new Error("Registrations not found")
    const seatCounts = registrations?.filter((reg) => {
      return reg.game_id !== null && reg.member_id !== null
    }).reduce((acc, reg) => {
      const game = gamesData?.find((game) => game.game_id === reg.game_id);
        if (game) {
          acc[reg.game_id] = (acc[reg.game_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    console.log(seatCounts);

    const { data: favorites, error: favoritesError } = await supabase
      .from('game_favorites')
      .select(`
        game_id,
        member_id
      `)
      .eq('member_id', user.id);
    
    if (favoritesError) {
      console.error(favoritesError);
    }

    console.log(favorites);

    const scheduledGames: GameData[] = (gamesData as unknown as SupaGameScheduleData[]).map((gameSchedule) => {
      return {
        id: gameSchedule.id,
        game_id: gameSchedule.game_id,
        status: gameSchedule.status,
        interval: gameSchedule.interval,
        firstGameDate: gameSchedule.first_game_date,
        nextGameDate: gameSchedule.next_game_date,
        location: gameSchedule.location,
        dayOfWeek: gameSchedule.day_of_week,
        title: gameSchedule.games.title,
        description: gameSchedule.games.description,
        system: gameSchedule.games.system,
        maxSeats: gameSchedule.games.max_seats,
        currentSeats: seatCounts![gameSchedule.game_id] || 0,
        favorite: favorites?.some((favorite) => favorite.game_id === gameSchedule.game_id) || false,
        registered: registrations?.some((reg) => reg.game_id === gameSchedule.game_id && reg.member_id === user.id) || false,
        gamemaster_id: gameSchedule.games.members.id,
        gm_given_name: gameSchedule.games.members.profiles.given_name ?? "",
        gm_surname: gameSchedule.games.members.profiles.surname ?? "",
      }
    }) ?? [];

    if (gamesError) throw gamesError

    return scheduledGames
}

interface ToggleFavoriteVariables {
  userId: string;
  gameId: string;
  currentFavorite: boolean;
  supabase: SupabaseClient;
}

async function toggleFavorite({userId, gameId, currentFavorite, supabase}: ToggleFavoriteVariables): Promise<void> {
  if (currentFavorite) {
    console.log("Removing favorite for game ID:", gameId);
    const { error } = await supabase
        .from("game_favorites")
        .delete()
        .eq("game_id", gameId)
        .eq("member_id", userId);
    if (error) throw new Error(error.message);
  } else {
    console.log("Adding favorite for game ID:", gameId);
    const { error } = await supabase
        .from("game_favorites")
        .insert({ game_id: gameId, member_id: userId });
    if (error) throw new Error(error.message);
  }
}

export default function GamesDashboard(): React.ReactElement {
  const supabase = useSupabaseBrowserClient()
  const queryClient = useQueryClient();
  const session: Session | null = useSession();
  const user: User = (session?.user as User) ?? null;
  
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);

  const { data: games, isLoading } = useQuery<GameData[], Error>({
    queryKey: ['games', user, supabase],
    queryFn: () => fetchGames(supabase, user),
    enabled: !!user
  })

  

  const toggleFavoriteMutation = useMutation<void, Error, ToggleFavoriteVariables>({
    mutationFn:       toggleFavorite,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['games'] });
    }}
  );

  const handleToggleFavorite = (gameId: string, currentFavorite: boolean) => {
    toggleFavoriteMutation.mutate({userId: user.id, gameId, currentFavorite, supabase});
  }

  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (isLoading) return <div>Loading games...</div>;
  if (!games) return <div>No games found.</div>;

  return (<section className="flex flex-col bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-200 opacity-50 mt-4">
        <div className="pt-4 pl-4 opacity-100">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 dark:text-white">Games</h1>
        </div>
        <div className="space-y-8">
          <GameCarousel 
            games={games} 
            onSelectGame={setSelectedGame} 
            onToggleFavorite={handleToggleFavorite}
          />
          <GameDetails game={selectedGame} />
        </div>
      </section>
  )
}