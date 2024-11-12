import { getUser } from "@/server/authActions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
// import { Button } from '@/components/ui/button';
import { redirect } from "next/navigation";
import UpcomingGamesCard from "@/components/UpcomingGamesCard/UpcomingGamesCard";
import RegisteredCharactersCard from "@/components/RegisteredCharactersCard/RegisteredCharactersCard";
import RegisteredGamesCard from "@/components/RegisteredGamesCard/RegisteredGamesCard";
import { GameData, RegisteredCharacter, RegisteredGame, UpcomingGame } from "@/lib/types/custom";

export default async function MemberDashboard() {
  const supabase = createSupabaseBrowserClient();
  const user = await getUser();
  if (!user) {
    redirect('/login')
  }

  const today = new Date().toISOString();
  console.log('Date filter:', today);
  console.log('User Id:', user.id);
  // Fetch data
  const { data: upcomingGamesData, error: upcomingGamesError } = await supabase
    // .rpc('get_upcoming_games_with_counts', { 'member_id': user.id })
    // .select()
    // .order('first_game_date', { ascending: true })
    // .limit(5);
    .from('upcoming_games_view')
    .select('*')
    .eq('member_id', user.id, /* fetch member ID from session */)
    .order('first_game_date', { ascending: true })
    .limit(5);

  const { data: registeredGamesData, error: registeredGamesError } = await supabase
    .rpc('get_scheduled_games_with_counts', { 'member_id': user.id })
    .select()
    .order('first_game_date', { ascending: true });
  
  const { data: registeredCharactersData, error: registeredCharactersError } = await supabase
    .from('characters')
    .select('*')
    .eq('member_id', user.id, /* fetch member ID from session */);

  if (upcomingGamesError) {
    console.error(upcomingGamesError);
  } else {
    console.log(upcomingGamesData);
  }
  if (registeredGamesError) {
    console.error(registeredGamesError);
  } else {
    console.log(registeredGamesData);
  }
  if (registeredCharactersError) {
    console.error(registeredCharactersError);
  } else {
    console.log(registeredCharactersData);
  }

  const upcomingGames: UpcomingGame[] = (upcomingGamesData as GameData[])?.map((data) => {
    return {
      id: data.game_id,
      title: data.game_name,
      description: data.description,
      system: data.system,
      scheduled_for: data.first_game_date,
      status: data.status,
      num_players: data.num_players,
      gm_name: `${data.gm_given_name} ${data.gm_surname}`,
      gm_member_id: data.gamemaster_id,
    }
  }) ?? [];
  const registeredGames: RegisteredGame[] = (registeredGamesData as GameData[])?.map((data) => {
    return {
      id: data.game_id,
      title: data.game_name,
      description: data.description,
      system: data.system,
      scheduled_for: data.first_game_date,
      status: data.status,
      num_players: data.num_players,
      gm_name: `${data.gm_given_name} ${data.gm_surname}`,
      gm_member_id: data.gamemaster_id,
      registration_date: data.registered_at,
    }
  })  ?? [];
  // const registeredGames: RegisteredGame[] = [];
  const registeredCharacters: RegisteredCharacter[] = registeredCharactersData ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Upcoming Games Card */}
      <UpcomingGamesCard upcomingGames={upcomingGames}/>

      {/* Registered Games Card */}
      <RegisteredGamesCard registeredGames={registeredGames}/>

      {/* Registered Characters Card */}
      <RegisteredCharactersCard registeredCharacters={registeredCharacters}/>
    </div>
  );
}
