"use client";


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MyGamesCard } from "../MyGamesCard";
import { AnalyticsOverviewCard } from "../AnalyticsOverviewCard";
import { SessionNotesCard } from "../SessionNotesCard";
import { PendingInvitesCard } from "../PendingInvitesCard";
import { LocationsCard } from "../LocationsCard";

export default function GamemasterDashboardClient() {
  return (
      <section className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gamemaster Dashboard</h1>
          <Button asChild>
            <Link href="/gamemaster/games/new">+ New Game</Link>
          </Button>
        </header>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MyGamesCard />
          <AnalyticsOverviewCard />
          <SessionNotesCard />
          <PendingInvitesCard />
          <LocationsCard />
        </div>        
    </section>
  );
}
