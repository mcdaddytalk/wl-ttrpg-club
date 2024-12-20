"use client"

import { 
  useQuery, 
} from "@tanstack/react-query";
import UpcomingGamesCard from "@/components/UpcomingGamesCard/UpcomingGamesCard";
import RegisteredGamesCard from "@/components/RegisteredGamesCard/RegisteredGamesCard";
import { 
  RegisteredGame, 
  UpcomingGame 
} from "@/lib/types/custom";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";

const fetchUpcomingGames = async (userId: string): Promise<UpcomingGame[]> => {
  try {
    const response = await fetch(`/api/members/${userId}/upcoming-games`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new Error('Failed to fetch upcoming games');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
};

const fetchRegisteredGames = async (userId: string): Promise<RegisteredGame[]> => {
  try {
    const response = await fetch(`/api/members/${userId}/registered-games`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch registered games');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching registered games:', error);
    return [];
  }
}

export default function MemberDashboard(): React.ReactElement {
  const session = useSession();
  const user: User = (session?.user as User) ?? {};

  // Fetch data
  const { data: upcomingGames, isLoading: upcomingGamesLoading, isError: isUpcomingGamesError, error: upcomingGamesError } = useQuery<UpcomingGame[]>({
    queryKey: ['upcoming-games',  user.id],
    queryFn: () => fetchUpcomingGames(user.id),
    enabled: !!user.id,
  });

  const { data: registeredGames, isLoading: registeredGamesLoading, isError: isRegisteredGamesError, error: registeredGamesError } = useQuery<RegisteredGame[]>({
    queryKey: ['registered-games', user.id],
    queryFn: () => fetchRegisteredGames(user.id),
    enabled: !!user.id,
  })
    
  if (isUpcomingGamesError || isRegisteredGamesError) {
    const errorArray = [upcomingGamesError, registeredGamesError];
    const errorMessages = errorArray.filter((error) => error !== null).map((error) => error?.message);
    console.error('Error fetching upcoming games:', errorMessages.join(', '));
  }

  if (!user) return <div>Please log in to access the dashboard.</div>;
  if (upcomingGamesLoading || registeredGamesLoading) return <div>Loading Your Scheduled Games...</div>;
  
// const registeredGames: RegisteredGame[] = [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Upcoming Games Card */}
      <UpcomingGamesCard upcomingGames={upcomingGames || []}/>

      {/* Registered Games Card */}
      <RegisteredGamesCard registeredGames={registeredGames || []}/>

      {/* Registered Characters Card */}
    </div>
  );
}
