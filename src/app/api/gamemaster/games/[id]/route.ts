import { GMGameDataResponse } from "@/lib/types/custom";
import { GMGameDO } from "@/lib/types/data-objects";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> } ): Promise<NextResponse> {
    if (request.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!member) {
    return NextResponse.json({ message: "Member not found" }, { status: 403 });
  }

  const { data: gameData, error } = await supabase
    .from("games")
    .select(`
      *,
      game_schedule(*),
      gamemaster_id,
      gamemaster: members!fk_games_members (
        id,
        email,
        profiles (
          avatar,
          given_name,
          surname
        )
      )
    `)
    .eq("id", id)
    .eq("gamemaster_id", member.id)
    .single() as unknown as GMGameDataResponse;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!gameData) {
    return NextResponse.json({ message: "Game not found" }, { status: 404 });
  }

  // Invite count
  const { data: inviteData, count: inviteCount } = await supabase
    .from("game_invites")
    .select("id")
    .eq("game_id", gameData.id)
    .eq("status", "pending");

  // Registrants
  const { data: registered } = await supabase
    .from("game_registrations")
    .select("id, status")  
    .eq("game_id", gameData.id);
  
  const pendingRegistrants = registered?.filter((reg) => reg.status === "pending");
  const confirmedRegistrants = registered?.filter((reg) => reg.status === "approved");

  logger.debug("Game data", gameData)
  logger.debug('Game Invites', inviteData)

  const games: GMGameDO = {
    id: gameData.id,
    title: gameData.title,
    description: gameData.description,
    system: gameData.system,
    coverImage: gameData.cover_image,
    gameCode: gameData.game_code,
    scheduled_next: gameData.game_schedule[0].next_game_date,
    interval: gameData.game_schedule[0].interval,
    dow: gameData.game_schedule[0].day_of_week,
    maxSeats: gameData.max_seats,
    startingSeats: gameData.starting_seats,
    status: gameData.status,
    content_warnings: gameData.content_warnings,
    schedStatus: gameData.game_schedule[0].status,
    location_id: gameData.game_schedule[0].location_id,
    location: gameData.game_schedule[0].location,
    visibility: gameData.visibility,
    invites: inviteCount ?? 0,
    pending: pendingRegistrants?.length ?? 0,
    registered: confirmedRegistrants?.length ?? 0,
    gamemaster_id: gameData.gamemaster_id,
    gamemaster: gameData.gamemaster
  }

  return NextResponse.json(games);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> } ): Promise<NextResponse> {
  if (request.method !== "PATCH") {
      return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const body = await request.json();

  logger.debug("Updating game", body);
  const { 
    title, 
    description, 
    max_seats: maxSeats,
    starting_seats: startingSeats,
    visibility,
    cover_image: coverImage,
    content_warnings,
    system,
    status, 
    interval, 
    day_of_week: dayOfWeek,
    next_game_date: nextGameDate,
    schedule_status:schedStatus,    
    location_id 
  } = body;

  try {
    const { error } = await supabase.from('games').update({
      title,
      description,
      system,
      max_seats: maxSeats,
      starting_seats: startingSeats,
      visibility,
      cover_image: coverImage,
      content_warnings,
      status
    }).eq('id', id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const { error: gameScheduleError } = await supabase
        .from('game_schedule')
        .update({
            interval,
            location_id,
            status: schedStatus,
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
