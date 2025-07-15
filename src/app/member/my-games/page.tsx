"use client"

import React, { useState } from "react"
import { useMyGames } from "@/hooks/member/useMyGames";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { SkeletonArray } from "@/components/ui/skeleton-array";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { formatDate } from "@/utils/helpers";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { toast } from "sonner";
import logger from "@/utils/logger";

export default function MyGamesDashboard(): React.ReactElement {
  const router = useRouter();
  const session = useSession();
  const user: User = (session?.user as User) ?? {};
  
  const { games, upcomingGames, error, isLoading, loadingUpcoming, leaveGame } = useMyGames();
  const [gamePendingLeave, setGamePendingLeave] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const handleConfirmLeave = async () => {
    if (!gamePendingLeave) return;
  
    try {
      setConfirmLoading(true);
      await leaveGame.mutateAsync(gamePendingLeave);
      toast.success("You have left the game.");
    } catch (err) {
      toast.error("Failed to leave the game.");
      logger.error(err);
    } finally {
      setConfirmLoading(false);
      setGamePendingLeave(null);
    }
  };


  if (error) redirect("/error");
  if (!user) return <div><p className="text-center text-red-500">You must be logged in to view this page.</p></div>;
  if (isLoading || loadingUpcoming) return <div>Loading Your Scheduled Games...</div>;
  
  return (
    <div className="container mx-auto p-4">
      {/* 🗓️ Upcoming Games */}
      <div className="mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Upcoming Games (Next 2 Weeks)</h2>

          {loadingUpcoming ? (
            <SkeletonArray count={2} />
          ) : upcomingGames?.length === 0 ? (
            <p className="text-gray-500">No upcoming games.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Game</th>
                  <th className="border border-gray-300 p-2 text-left">Date</th>
                  <th className="border border-gray-300 p-2 text-left">Location</th>
                  <th className="border border-gray-300 p-2 text-left">Gamemaster</th>
                </tr>
              </thead>
              <tbody>
                {upcomingGames?.map((game) => (
                  <tr
                    key={game.id}
                    className="cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => router.push(`/games/adventure/${game.id}`)}
                  >
                    <td className="border border-gray-300 p-2">{game.title}</td>
                    <td className="border border-gray-300 p-2">{game.scheduled_for ? formatDate(game.scheduled_for) : "TBD"}</td>
                    <td className="border border-gray-300 p-2">{game.location.name || "TBD"}</td>
                    <td className="border border-gray-300 p-2">
                      {game.gm_given_name} {game.gm_surname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🎮 Registered Games */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Registered Games</h2>
      {isLoading ? <SkeletonArray count={3} /> : (
        games?.length === 0 ? <p className="text-gray-500">You are not registered for any games.</p> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games?.map((game) => (
            <GameCard key={game.id} game={game} onClick={() => router.push(`/games/adventure/${game.id}`)}>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setGamePendingLeave(game.id);
                }}
              >
                Leave Game
              </Button>
            </GameCard>
          ))}
        </div>
      )}
      <ConfirmationModal
        title="Leave Game?"
        description="Are you sure you want to leave this game? You may need to request a new invite to rejoin."
        isOpen={!!gamePendingLeave}
        isLoading={confirmLoading}
        onCancel={() => {
          if (!confirmLoading) setGamePendingLeave(null);
        }}
        onConfirm={handleConfirmLeave}
      />
    </div>
  );
}
