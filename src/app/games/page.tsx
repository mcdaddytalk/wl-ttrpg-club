"use client"

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GameCarousel from "@/components/GameCarousel";
import GameDetails from "@/components/GameDetails";
import { GameData } from "@/lib/types/custom";
import useSupabaseBrowserClient from "@/utils/supabase/client";
import useSession from "@/utils/supabase/use-session";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { useQueryClient } from "@/hooks/useQueryClient";
// import { fetchRegistrants } from "@/queries/fetchRegistrants";

async function fetchGames(userId: string): Promise<GameData[]> {
  const response = await fetch(`/api/games?member_id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching games");
  }

  switch (response.status) {
    case 500:
      throw new Error("Error fetching games");
    case 404:
      throw new Error("Games not found");
    case 200:
      const games = await response.json();
      return games;
    default:
      throw new Error("Error fetching games");
  }
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

  const { data: games, isLoading: gamesLoading } = useQuery<GameData[], Error>({
    queryKey: ['games', user?.id, 'full'],
    queryFn: () => fetchGames(user?.id),
    initialData: [],
    enabled: !!user
  })

  

  const toggleFavoriteMutation = useMutation<void, Error, ToggleFavoriteVariables>({
    mutationFn:       toggleFavorite,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['games', user?.id, 'full'] });
    }}
  );

  const handleToggleFavorite = (gameId: string, currentFavorite: boolean) => {
    toggleFavoriteMutation.mutate({userId: user?.id, gameId, currentFavorite, supabase});
  }

  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (gamesLoading) return <div>Loading games...</div>;
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