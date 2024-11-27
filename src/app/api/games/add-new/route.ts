import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest): Promise<NextResponse> {

  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  const supabase = await createSupabaseServerClient();

  const body = await request.json();

  const { title, description, system, interval, dayOfWeek, nextGameDate, maxSeats, gamemaster_id } = body;

  try {
    const { data, error } = await supabase.from('games').insert({
      title,
      description,
      system,
      max_seats: maxSeats,
      gamemaster_id
    }).select('id');

    if (error) {
      throw error;
    }
    
    const { error: gameScheduleError } = await supabase
        .from('game_schedule')
        .insert({
            game_id: data[0].id,
            status: 'awaiting-players',
            interval,
            first_game_date: nextGameDate,
            next_game_date: nextGameDate,
            day_of_week: dayOfWeek,
    })

    if (gameScheduleError) {
        throw gameScheduleError;
    }

    return NextResponse.json({ message: 'Game added successfully', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
