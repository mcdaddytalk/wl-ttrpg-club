import GameList from "@/components/GameList/GameList";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { GMGameData } from "@/lib/types/custom";
import { getUser } from "@/server/authActions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    maxSeats: game.max_seats,
    status: game.game_schedule[0]?.status,
    seats: seatCounts![game.id] || 0,
  })) ?? [];
  
  return (
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
  );
}