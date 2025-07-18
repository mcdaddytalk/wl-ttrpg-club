"use client";

import { Button } from "@/components/ui/button";
import { MyGamesCard } from "../MyGamesCard";
import { AnalyticsOverviewCard } from "../AnalyticsOverviewCard";
import { SessionNotesCard } from "../SessionNotesCard";
import { PendingInvitesCard } from "../PendingInvitesCard";
import { LocationsCard } from "../LocationsCard";
import { useRefreshGames } from "@/hooks/gamemaster/useGamemasterGames";
import { useGamemasterLocations } from "@/hooks/gamemaster/useGamemasterLocations";
import { User } from "@supabase/supabase-js";
import useSession from "@/utils/supabase/use-session";
import { useState } from "react";
import NewGameModal from "@/components/modals/NewGameModal";

export default function GamemasterDashboardClient() {
  const [isNewGameModalOpen, setNewGameModalOpen] = useState(false);
  const session = useSession();
  const user: User = session?.user as User;
  const gamemaster_id = user?.id;
  const { locations } = useGamemasterLocations();
  const { mutate: refreshGames } = useRefreshGames();

  const handleGameAdded = () => {
    setNewGameModalOpen(false);
    refreshGames();
  };


  return (
      <section className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gamemaster Dashboard</h1>
          <Button onClick={() => setNewGameModalOpen(true)}>+ New Game</Button>
        </header>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MyGamesCard />
          <AnalyticsOverviewCard />
          <SessionNotesCard />
          <PendingInvitesCard />
          <LocationsCard />
        </div>
        <NewGameModal
          isOpen={isNewGameModalOpen}
          onClose={() => setNewGameModalOpen(false)}
          onGameAdded={handleGameAdded}
          gamemaster_id={gamemaster_id}
          locations={locations || []}
        />
    </section>
  );
}
