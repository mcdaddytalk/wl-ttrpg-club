import GameList from "@/components/GameList/GameList";
import ScheduledGamesCard from "@/components/ScheduledGamesCard/ScheduledGamesCard";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GMGameData } from "@/lib/types/custom";
import { getUser } from "@/server/authActions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";

import { mockScheduledGames } from "@/mockData/GameData";

export default async function GamemasterDashboard() {
  const supabase = createSupabaseBrowserClient();
  const user = await getUser();

  if (!user) {
    redirect('/login')
  }

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
    .eq('gamemaster_id', user.id);

  const gameIds = gamesData?.map((game) => game.id) ?? [];

  const { data: registrations, error: registrationsError } = await supabase
    .from('game_registrations')
    .select(`
      game_id,
      member_id
    `)
    //.eq('games.gamemaster_id', user.id);
    .in('game_id', gameIds);
    
  if (gamesError) {
    console.error(gamesError);
  } else {
    console.log(gamesData);
  }
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
    scheduled_for: game.game_schedule[0]?.next_game_date,
    interval: game.game_schedule[0]?.interval,
    day_of_week: game.game_schedule[0]?.day_of_week,
    maxSeats: game.max_seats,
    status: game.game_schedule[0]?.status,
    seats: seatCounts![game.id] || 0,
  })) ?? [];
  
  const scheduledGames = mockScheduledGames;

  return (
    <section className="items-center justify-center border-4 border-red-500">
      <div className="w-full space-y-4 border-4 border-blue-500 p-2 m-2">
        <ScheduledGamesCard scheduledGames={scheduledGames} />        
      </div>
      <div className="w-full flex flex-wrap space-y-4 border-4 border-green-500 p-2 m-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">GM Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="default">
              <Link href="/gamemaster/add-game">Create New Game</Link>
            </Button>
            <GameList games={combinedData} />
          </CardContent>
        </Card>                 
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upcoming Games</CardTitle>
          </CardHeader>
          <CardContent>
            <GameList games={combinedData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upcoming Games</CardTitle>
          </CardHeader>
          <CardContent>
            <GameList games={combinedData} />
          </CardContent>
        </Card>
        <div>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>  
        </div>
      </div>
    </section>
  );
}