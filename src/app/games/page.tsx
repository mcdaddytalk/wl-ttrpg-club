"use client"

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GameCarousel from "@/components/GameCarousel";
import GameDetails from "@/components/GameDetails";
import { GameData, GameFavorite } from "@/lib/types/custom";
import useSession from "@/utils/supabase/use-session";
import { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@/hooks/useQueryClient";

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
}

async function toggleFavorite({userId, gameId, currentFavorite}: ToggleFavoriteVariables): Promise<void> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (currentFavorite) {
    console.log("Removing favorite for game ID:", gameId);
    const response = await fetch(`/api/members/${userId}/favorites`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_id: gameId })
      }
    );

    if (!response.ok) {
      throw new Error("Error toggling favorite");
    }
  } else {
    console.log("Adding favorite for game ID:", gameId);
    const response = await fetch(`/api/members/${userId}/favorites`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_id: gameId })
      }
    );

    if (!response.ok) {
      throw new Error("Error toggling favorite");
    }
  }
}

export default function GamesDashboard(): React.ReactElement {
  const queryClient = useQueryClient();
  const session: Session | null = useSession();
  const user: User = (session?.user as User) ?? null;
  
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
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
      console.log('Enhancing games...');
      setEnhancedGames(games.map((game) => ({
        ...game,
        favorite: favorites.some((favorite) => favorite.game_id === game.game_id) || false,
        registered: game.registrations.some((registration) => registration.member_id === user?.id) || false
      })))
    }
  }, [games, favorites, user]);

  
  const toggleFavoriteMutation = useMutation<void, Error, ToggleFavoriteVariables>({
    mutationFn:       toggleFavorite,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['games', user?.id, 'full'] });
        queryClient.invalidateQueries({ queryKey: ['games', 'favorites', user?.id] });
      },
      onError: (error) => {
        console.error('Error toggling favorite:', error);
      }
    }
  );

  const handleToggleFavorite = (gameId: string, currentFavorite: boolean) => {
    toggleFavoriteMutation.mutate({userId: user?.id, gameId, currentFavorite});
  }

  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (gamesLoading || favoritesLoading) return <div>Loading games...</div>;
  if (!enhancedGames) return <div>No games found.</div>;

  return (
    <section className="flex flex-col mt-4"> {/* bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-200 */}
      <div className="space-y-8">
        <GameCarousel 
          games={enhancedGames} 
          onSelectGame={setSelectedGame} 
          onToggleFavorite={handleToggleFavorite}
        />
        <GameDetails game={selectedGame} />
      </div>
    </section>
  )
}