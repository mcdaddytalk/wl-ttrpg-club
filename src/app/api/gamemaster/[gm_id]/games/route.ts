import { DOW, GMGameData } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type GamemasterParams = {
    gm_id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<GamemasterParams> } ): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { gm_id } = await params;    
  console.log('GM ID:', gm_id);
  if (!gm_id) {
    return NextResponse.json({ message: `GM ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();
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
          status,
          location        
        )    
      `)
    .eq('gamemaster_id', gm_id);

    if (gamesError) {
      console.log(gamesError);
      return NextResponse.json({ message: gamesError.message }, { status: 500 })
    }

    if (!gamesData) {
      return NextResponse.json({ message: `No games found` }, { status: 404 })
    }
    
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
        member_id
      `)
      //.eq('games.gamemaster_id', user.id);
      .in('game_id', gameIds);
    
    if (registrationsError) {
      console.error(registrationsError);
      return NextResponse.json({ message: registrationsError.message }, { status: 500 })
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
      description: game.description ?? '',
      system: game.system ?? '',
      scheduled_next: new Date(game.game_schedule[0]?.next_game_date as string),
      interval: game.game_schedule[0]?.interval,
      dow: game.game_schedule[0]?.day_of_week as DOW,
      maxSeats: game.max_seats as number,
      status: game.game_schedule[0]?.status,
      location: game.game_schedule[0]?.location ?? '',
      registered: seatCounts![game.id] || 0,
    })) ?? [];
    // const combinedData = mockScheduledGames;

    return NextResponse.json(combinedData, { status: 200 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<GamemasterParams> } ): Promise<NextResponse> {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { gm_id } = await params;
  const body = await request.json();
  console.log(body)
  console.log('GM ID:', gm_id);
  if (!gm_id) {
    return NextResponse.json({ message: `GM ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();

  const { title, description, system, interval, dayOfWeek, nextGameDate, maxSeats } = body;

  try {
    const { data, error } = await supabase.from('games').insert({
      title,
      description,
      system,
      max_seats: maxSeats,
      gamemaster_id: gm_id
    }).select('id');

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const { error: gameScheduleError } = await supabase
        .from('game_schedule')
        .insert({
            game_id: data[0].id,
            status: 'draft',
            interval,
            first_game_date: nextGameDate,
            next_game_date: nextGameDate,
            day_of_week: dayOfWeek,
    })

    if (gameScheduleError) {
        console.error(gameScheduleError);
        return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game added successfully', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<GamemasterParams> } ): Promise<NextResponse> {
  if (request.method !== 'DELETE') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { gm_id } = await params;
  const body = await request.json();
  console.log(body)
  console.log('GM ID:', gm_id);
  if (!gm_id) {
    return NextResponse.json({ message: `GM ID is required` }, { status: 403 })
  }  

  const supabase = await createSupabaseServerClient();

  const { id } = body;

  try {
    const { error } = await supabase
      .from('games')
      .update({ 
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { error: gameScheduleError } = await supabase
      .from('game_schedule')
      .update({ 
        status: 'canceled'
      })
      .eq('game_id', id);
    
    if (gameScheduleError) {
      console.error(gameScheduleError);
      return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<GamemasterParams> } ): Promise<NextResponse> {
  if (request.method !== 'PUT') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }  

  const { gm_id } = await params;
  const body = await request.json();
  console.log(body)
  console.log('GM ID:', gm_id);
  if (!gm_id) {
    return NextResponse.json({ message: `GM ID is required` }, { status: 403 })
  }  

  const supabase = await createSupabaseServerClient();

  const { 
    id,
    title,
    description,
    system,
    maxSeats,
    status,
    location,
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
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { error: gameScheduleError } = await supabase
        .from('game_schedule')
        .update({
            interval,
            status,
            location,
            next_game_date: nextGameDate,
            day_of_week: dayOfWeek,
            updated_at: new Date().toISOString()
        })
        .eq('game_id', id)
        .select('*');
    
    if (gameScheduleError) {
        console.error(gameScheduleError);
        return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


export async function PATCH(request: NextRequest, { params }: { params: Promise<GamemasterParams> } ): Promise<NextResponse> {
  if (request.method !== 'PATCH') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }  

  const { gm_id } = await params;
  const body = await request.json();
  console.log(body)
  console.log('GM ID:', gm_id);
  if (!gm_id) {
    return NextResponse.json({ message: `GM ID is required` }, { status: 403 })
  }  

  const supabase = await createSupabaseServerClient();

  const { id, title, description, system, interval, dayOfWeek, nextGameDate, maxSeats } = body;

  try {
    const { error } = await supabase.from('games').update({
      title,
      description,
      system,
      max_seats: maxSeats,
    }).eq('id', id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const { error: gameScheduleError } = await supabase
        .from('game_schedule')
        .update({
            interval,
            first_game_date: nextGameDate,
            next_game_date: nextGameDate,
            day_of_week: dayOfWeek,
        })
        .eq('game_id', id)

    if (gameScheduleError) {
        console.error(gameScheduleError);
        return NextResponse.json({ error: gameScheduleError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}