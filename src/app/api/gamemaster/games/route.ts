import { DOW, GMGameDataListResponse } from "@/lib/types/custom";
import { GMGameDO } from "@/lib/types/data-objects";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;
  const { data: gamesData, error: gamesError } = await supabase
    .from('games')
    .select(`
        id, 
        title, 
        description,
        system,
        cover_image, 
        status,
        max_seats,
        visibility,
        starting_seats,
        content_warnings,
        gamemaster: members!fk_games_members (
          id,
          profiles (
            given_name,
            surname,
            avatar
          )
        ),
        game_schedule(
          id,
          game_id,
          interval,
          day_of_week,
          first_game_date,
          next_game_date,
          last_game_date,
          status,
          location:locations!game_schedule_location_id_fkey(
                    *
                )        
        )    
      `)
    .eq('gamemaster_id', gm_id) as unknown as GMGameDataListResponse;

    if (gamesError) {
      logger.error(gamesError);
      return NextResponse.json({ message: gamesError.message }, { status: 500 })
    }

    if (!gamesData) {
      return NextResponse.json({ message: `No games found` }, { status: 404 })
    }

    logger.debug(`GAME DATA: ${JSON.stringify(gamesData)}`)
    
    if (gamesData) {
      gamesData.sort((a, b) => {
        const nextGameA = a.game_schedule[0]?.next_game_date;
        const nextGameB = b.game_schedule[0]?.next_game_date;
        if (!nextGameA || !nextGameB) {
          return 0;
        }
        return new Date(nextGameA).getMilliseconds() - new Date(nextGameB).getMilliseconds();
      });
    }


    const gameIds = gamesData?.map((game) => game.id) ?? [];

    const { data: registrations, error: registrationsError } = await supabase
      .from('game_registrations')
      .select(`
        game_id,
        member_id,
        status
      `)
      //.eq('games.gamemaster_id', user.id);
      .in('game_id', gameIds);
    
    if (registrationsError) {
      logger.error(registrationsError);
      return NextResponse.json({ message: registrationsError.message }, { status: 500 })
    }

    const { data: invites, error: invitesError } = await supabase
      .from('game_invites')
      .select(`*`)
      .in('game_id', gameIds);

    if (invitesError) {
      logger.error(invitesError);
      return NextResponse.json({ message: invitesError.message }, { status: 500 })
    }

    const inviteCounts = invites?.reduce((acc, invite) => {
      const game = gamesData?.find((game) => game.id === invite.game_id);
      if (!game) return acc;
      acc[invite.game_id as string] = (acc[invite.game_id as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const seatCounts = registrations?.reduce((acc, reg) => {
      const game = gamesData?.find((game) => game.id === reg.game_id && reg.status === 'approved');
        if (game) {
          acc[reg.game_id] = (acc[reg.game_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    const pending = registrations?.reduce((acc, reg) => {
      const game = gamesData?.find((game) => game.id === reg.game_id && reg.status === 'pending');
        if (game) {
          acc[reg.game_id] = (acc[reg.game_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    const combinedData: GMGameDO[] = gamesData?.map(game => ({
      id: game.id,
      title: game.title,
      description: game.description ?? '',
      system: game.system ?? '',
      coverImage: game.cover_image ?? 'default',
      gameCode: game.game_code ?? '',
      gamemaster: game.gamemaster,
      scheduled_next: game.game_schedule[0]?.next_game_date,
      interval: game.game_schedule[0]?.interval,
      dow: game.game_schedule[0]?.day_of_week as DOW,
      maxSeats: game.max_seats as number,
      startingSeats: game.starting_seats as number,
      content_warnings: game.content_warnings ?? '',
      visibility: game.visibility,
      status: game.status,
      schedStatus: game.game_schedule[0]?.status,
      location_id: game.game_schedule[0]?.location_id,
      location: game.game_schedule[0]?.location ?? '',
      invites: inviteCounts[game.id] ?? 0,
      pending: pending[game.id] ?? 0,
      registered: seatCounts[game.id] ?? 0,
    })) ?? [];
    // const combinedData = mockScheduledGames;

    return NextResponse.json(combinedData, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;

  const body = await request.json();

  const { title, description, system, visibility, interval, day_of_week: dayOfWeek, next_game_date: nextGameDate, max_seats: maxSeats, starting_seats: startingSeats, location_id } = body;

  try {
    const { data, error } = await supabase.from('games').insert({
      title,
      description,
      system,
      visibility,
      max_seats: maxSeats,
      starting_seats: startingSeats || 0,
      gamemaster_id: gm_id
    }).select('id');

    if (error) {
      logger.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const { error: gameScheduleError } = await supabase
        .from('game_schedule')
        .insert({
            game_id: data[0].id,
            status: 'draft',
            interval,
            location_id,
            first_game_date: nextGameDate,
            next_game_date: nextGameDate,
            day_of_week: dayOfWeek,
    })

    if (gameScheduleError) {
        logger.error(gameScheduleError);
        return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game added successfully', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'DELETE') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;

  const body = await request.json();

  const { id } = body;

  try {
    const { error } = await supabase
      .from('games')
      .update({ 
        deleted_at: new Date().toISOString()
      })
      .eq('gamemaster_id', gm_id)
      .eq('id', id);

    if (error) {
      logger.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { error: gameScheduleError } = await supabase
      .from('game_schedule')
      .update({ 
        status: 'canceled'
      })
      .eq('gamemaster_id', gm_id)
      .eq('game_id', id);
    
    if (gameScheduleError) {
      logger.error(gameScheduleError);
      return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'PUT') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }  

  const supabase = await createSupabaseServerClient();

  const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
  
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const gm_id = user.id;

    const body = await request.json();

    const { 
      id,
      title,
      description,
      system,
      maxSeats,
      startingSeats,
      status,
      location_id,
      nextGameDate,
      interval,
      dayOfWeek
    } = body;

    try {
      const { error } = await supabase
        .from('games')
        .update({
          title,
          description,
          system,
          max_seats: maxSeats,
          starting_seats: startingSeats,
          updated_at: new Date().toISOString()
        })
        .eq('gamemaster_id', gm_id)
        .eq('id', id);

      if (error) {
        logger.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      const { error: gameScheduleError } = await supabase
          .from('game_schedule')
          .update({
              interval,
              status,
              location_id,
              next_game_date: nextGameDate,
              day_of_week: dayOfWeek,
              updated_at: new Date().toISOString()
          })
          .eq('game_id', id)
          .select('*');
      
      if (gameScheduleError) {
          logger.error(gameScheduleError);
          return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
      }

      return NextResponse.json({ message: 'Game updated successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'PATCH') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }  

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;

  const body = await request.json();

  const { id, title, description, system, interval, dayOfWeek, nextGameDate, maxSeats, location_id } = body;

  try {
    const { error } = await supabase.from('games').update({
      title,
      description,
      system,
      max_seats: maxSeats,
    })
    .eq('gamemaster_id', gm_id)
    .eq('id', id);

    if (error) {
      logger.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const { error: gameScheduleError } = await supabase
        .from('game_schedule')
        .update({
            interval,
            location_id,
            first_game_date: nextGameDate,
            next_game_date: nextGameDate,
            day_of_week: dayOfWeek,
        })
        .eq('game_id', id)

    if (gameScheduleError) {
        logger.error(gameScheduleError);
        return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}