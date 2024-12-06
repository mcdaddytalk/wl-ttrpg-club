"use client"

import useSupabaseBrowserClient from "@/utils/supabase/client";
import { 
  useQuery, 
//  useQueryClient 
} from "@tanstack/react-query";
import UpcomingGamesCard from "@/components/UpcomingGamesCard/UpcomingGamesCard";
// import RegisteredCharactersCard from "@/components/RegisteredCharactersCard/RegisteredCharactersCard";
import RegisteredGamesCard from "@/components/RegisteredGamesCard/RegisteredGamesCard";
import { 
  GameData, 
  // RegisteredCharacter, 
  RegisteredGame, 
  UpcomingGame 
} from "@/lib/types/custom";
import useSession from "@/utils/supabase/use-session";
import { SupabaseClient, User } from "@supabase/supabase-js";

async function fetchUpcomingGames(supabase: SupabaseClient, memberId: string): Promise<UpcomingGame[] | null> {
  const { data, error } = await supabase
    .from('upcoming_games_view')
    .select('*')
    .eq('member_id', memberId, /* fetch member ID from session */)
    .order('first_game_date', { ascending: true })
    .limit(5);

  if (error) {
    console.error('Error fetching upcoming games:', error);
    return null;
  }
  const upcomingGames: UpcomingGame[] = (data as GameData[])?.map((game) => {
    return {
      id: game.game_id,
      title: game.title,
      description: game.description,
      system: game.system,
      scheduled_for: game.nextGameDate,
      status: game.status,
      num_players: game.currentSeats,
      gm_name: `${game.gm_given_name} ${game.gm_surname}`,
      gm_member_id: game.gamemaster_id,
    }
  }) ?? [];
  return upcomingGames;
}

async function fetchRegisteredGames(supabase: SupabaseClient, memberId: string): Promise<RegisteredGame[] | null> {
  const { data: registeredGamesData, error: registeredGamesError } = await supabase
    .rpc('get_scheduled_games_with_counts', { 'member_id': memberId })
    .select()
    .order('first_game_date', { ascending: true });
  
  if (registeredGamesError) {
    console.error('Error fetching registered games:', registeredGamesError);
    return null;
  }

  const registeredGames: RegisteredGame[] = (registeredGamesData as GameData[])?.map((data) => {
    return {
      id: data.game_id,
      title: data.title,
      description: data.description,
      system: data.system,
      scheduled_for: data.nextGameDate,
      status: data.status,
      num_players: data.currentSeats,
      gm_name: `${data.gm_given_name} ${data.gm_surname}`,
      gm_member_id: data.gamemaster_id,
      registration_date: null,
    }
  })  ?? [];
  return registeredGames;
}

export default function MemberDashboard(): React.ReactElement {
  const supabase = useSupabaseBrowserClient();
  // const queryClient = useQueryClient();
  const session = useSession();
  const user: User = (session?.user as User) ?? {};
  console.log('Session:  ', session);
  console.log('User:  ', user);

  const today = new Date().toISOString();
  console.log('Date filter:', today);
  console.log('User Id:', user.id);
  // Fetch data
  const { data: upcomingGames, isLoading, error: upcomingGamesError } = useQuery<UpcomingGame[] | null>({
    queryKey: ['upcoming-games', supabase, user.id],
    queryFn: () => fetchUpcomingGames(supabase, user.id),
    initialData: [],
    // enabled: !!user.id,
  });

  const { data: registeredGames, error: registeredGamesError } = useQuery<RegisteredGame[] | null>({
    queryKey: ['registered-games', supabase, user.id],
    queryFn: () => fetchRegisteredGames(supabase, user.id),
    initialData: [],
    // enabled: !!user.id,
  })
    
  if (upcomingGamesError || registeredGamesError) {
    console.error('Error fetching upcoming games:', upcomingGamesError);
    console.error('Error fetching registered games:', registeredGamesError);
  }

  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (isLoading) return <div>Loading Gamemaster Games...</div>;
  
// const registeredGames: RegisteredGame[] = [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Upcoming Games Card */}
      <UpcomingGamesCard upcomingGames={upcomingGames}/>

      {/* Registered Games Card */}
      <RegisteredGamesCard registeredGames={registeredGames}/>

      {/* Registered Characters Card */}
    </div>
  );
}
