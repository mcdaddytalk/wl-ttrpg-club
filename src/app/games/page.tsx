"use client"

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameCarousel from "@/components/GameCarousel";
import { GameData, GameFavorite } from "@/lib/types/custom";
import useSession from "@/utils/supabase/use-session";
import { Session, User } from "@supabase/supabase-js";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";

async function fetchFavorites(userId: string): Promise<GameFavorite[]> {
  const response = await fetch(`/api/members/${userId}/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching favorites");
  }

  switch (response.status) {
    case 500:
      throw new Error("Error fetching favorites");
    case 404:
      throw new Error("Favorites not found");
    case 200:
      const favorites = await response.json();
      return favorites as GameFavorite[];
    default:
      throw new Error("Error fetching favorites");
  }
}

async function fetchGames(userId: string): Promise<GameData[]> {
  const response = await fetch(`/api/games?member_id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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

export default function GamesDashboard(): React.ReactElement {
  const { mutate: toggleFavorite } = useToggleFavorite();
  const session: Session | null = useSession();
  const user: User = (session?.user as User) ?? null;
  
  const [enhancedGames, setEnhancedGames] = useState<GameData[] | null>(null);

  const { data: games, isLoading: gamesLoading } = useQuery<GameData[], Error>({
    queryKey: ['games', user?.id, 'full'],
    queryFn: () => fetchGames(user?.id),
    enabled: !!user
  })

  const { data: favorites, isLoading: favoritesLoading } = useQuery<GameFavorite[], Error>({
    queryKey: ['games', 'favorites', user?.id],
    queryFn: () => fetchFavorites(user?.id),
    enabled: () => !!user
  })
    
  useEffect(() => {
    if (!!games && !!favorites) {
    // console.log('Enhancing games...');
      setEnhancedGames(games.map((game) => ({
        ...game,
        favorite: favorites.some((favorite) => favorite.game_id === game.game_id) || false,
        pending: game.registrations.some((registration) => registration.member_id === user?.id && registration.status === 'pending') || false,
        registered: game.registrations.some((registration) => registration.member_id === user?.id && registration.status === 'approved') || false
      })))
    }
  }, [games, favorites, user]);


  const handleToggleFavorite = (gameId: string, currentFavorite: boolean) => {
    toggleFavorite({userId: user?.id, gameId, favorite: currentFavorite});
  }

  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (gamesLoading || favoritesLoading) return <div>Loading games...</div>;
  if (!enhancedGames) return <div>No games found.</div>;

  return (
    <section className="flex flex-col mt-4"> {/* bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-200 */}
      <div className="space-y-8">
        <GameCarousel 
          games={enhancedGames} 
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </section>
  )
}