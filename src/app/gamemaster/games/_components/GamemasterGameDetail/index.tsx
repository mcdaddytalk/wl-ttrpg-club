"use client";

import { useGameRegistrants } from "@/hooks/gamemaster/useGamemasterPlayers";
import { useGamemasterInvites } from "@/hooks/gamemaster/useGamemasterInvites";
import { useGameDetails } from "@/hooks/gamemaster/useGamemasterGames";
import GameDetailsEditor from "../GameDetailsEditor";
import InvitedPlayersManager from "../InvitePlayerManager";
import RegisteredPlayersManager from "../RegisteredPlayersManager";


interface GamemasterGameDetailProps {
  gameId: string;
}

export default function GamemasterGameDetail({ gameId }: GamemasterGameDetailProps) {
  // Fetch game details
  const { data: game, isLoading: isGameLoading } = useGameDetails(gameId);
  const { data: invites, refetch: refreshInvites } = useGamemasterInvites(gameId);
  const { data: registrants, refetch: refreshRegistrants } = useGameRegistrants(gameId);
  
  if (isGameLoading || !game) {
    return <div className="p-4">Loading game details...</div>;
  }

  return (
    <section className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <GameDetailsEditor game={game} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Invited Players</h2>
        <InvitedPlayersManager 
          gameId={gameId} 
          invites={invites || []} 
          onInviteUpdated={() => refreshInvites()} 
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Registered Players</h2>
        <RegisteredPlayersManager 
          gameId={gameId} 
          registrants={registrants || []} 
          onRegistrantUpdated={() => refreshRegistrants()} 
        />
      </div>
    </section>
  );
}
