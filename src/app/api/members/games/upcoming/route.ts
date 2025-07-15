import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { UpcomingGamesResponse } from '@/lib/types/custom';
import { UpcomingGameDO } from '@/lib/types/data-objects';
import logger from '@/utils/logger';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('game_registrations')
    .select(`
        game_id, 
        games(
            title,
            game_schedule(
                status,
                next_game_date,
                location:locations!game_schedule_location_id_fkey(
                    *
                )
            )
        )            
    `)
    .eq('member_id', user.id) as unknown as UpcomingGamesResponse;

  if (error) {
    logger.error(error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: 'No games found' }, { status: 404 });
  }

  const now = new Date();

  logger.info("Before filtering", data.map(entry => entry.games.game_schedule[0].next_game_date));
  
  const sortedData = data
    .filter(entry => {
      const schedule = entry.games?.game_schedule?.[0];
      return schedule?.next_game_date && new Date(schedule.next_game_date) > now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.games.game_schedule[0].next_game_date);
      const dateB = new Date(b.games.game_schedule[0].next_game_date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  logger.info(sortedData);

  const games: UpcomingGameDO[] = sortedData.map((entry) => ({
    id: entry.game_id,
    title: entry.games.title,
    status: entry.games.game_schedule[0].status,
    next_session_date: entry.games.game_schedule[0].next_game_date,
    location: entry.games.game_schedule[0].location
  }));

  logger.info(games);

  return NextResponse.json(games);
}
