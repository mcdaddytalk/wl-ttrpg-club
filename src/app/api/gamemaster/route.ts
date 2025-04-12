import { GMGameSummaryDO, SupabaseGMGameSummaryListResponse } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
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

  const { data, error } = await supabase
    .from("games")
    .select(`
        id, 
        title, 
        system, 
        status, 
        max_seats,
        starting_seats,
        gamemaster_id,
        gamemaster:members!fk_games_members (
            email,
            profiles (
                given_name,
                surname
            )
        ),
        visibility,
        game_registrations(count),
        game_schedules(
          *
        )
    `)
    .eq("gamemaster_id", member.id)
    .order("created_at", { ascending: false }) as unknown as SupabaseGMGameSummaryListResponse;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const summarized: GMGameSummaryDO[] = data.map((game) => ({
    id: game.id,
    title: game.title,
    system: game.system,
    status: game.status,
    startingSeats: game.starting_seats,
    visibility: game.visibility,
    playerCount: game.game_registrations.count,
    playerLimit: game.max_seats,
    gamemaster: {
      id: game.gamemaster_id,
      email: game.gamemaster?.email,
      displayName: `${game.gamemaster?.profiles?.given_name} ${game.gamemaster?.profiles?.surname}`,
    },
    schedules: game.game_schedules,
  }));

  return NextResponse.json(summarized);
}
