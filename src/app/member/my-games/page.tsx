"use client"

import { useMyGames } from "@/hooks/useMyGames";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { SkeletonArray } from "@/components/ui/skeleton-array";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function MemberDashboard(): React.ReactElement {
  const session = useSession();
  const user: User = (session?.user as User) ?? {};
  const { games, upcomingGames, error, isLoading, loadingUpcoming, leaveGame } = useMyGames();

  if (error) redirect("/error");
  if (!user) return <div><p className="text-center text-red-500">You must be logged in to view this page.</p></div>;
  if (isLoading || loadingUpcoming) return <div>Loading Your Scheduled Games...</div>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Games</h1>

      {/* 🗓️ Upcoming Games */}
      <h2 className="text-xl font-semibold mb-2">Upcoming Games (Next 2 Weeks)</h2>
      {loadingUpcoming ? <SkeletonArray count={2} /> : (
        upcomingGames?.length === 0 ? <p className="text-gray-500">No upcoming games.</p> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingGames?.map((game) => (
            <GameCard key={game.id} game={game}>
              <p className="text-sm text-gray-500">Location: {game.location.name || "TBD"}</p>
              <p className="text-sm text-gray-500">Date: {game.scheduled_for?.toISOString() || "TBD"}</p>
            </GameCard>
          ))}
        </div>
      )}

      {/* 🎮 Registered Games */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Registered Games</h2>
      {isLoading ? <SkeletonArray count={3} /> : (
        games?.length === 0 ? <p className="text-gray-500">You are not registered for any games.</p> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games?.map((game) => (
            <GameCard key={game.id} game={game}>
              <Button variant="destructive" onClick={() => leaveGame.mutate(game.id)}>
                Leave Game
              </Button>
            </GameCard>
          ))}
        </div>
      )}
    </div>
  );
}
