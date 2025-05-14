import { GMGameDataResponse } from "@/lib/types/custom";
import { GMGameDO } from "@/lib/types/data-objects";
import { createSupabaseServerClient } from "@/utils/supabase/server";
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

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .eq("gamemaster_id", member.id)
    .single() as unknown as GMGameDataResponse;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: "Game not found" }, { status: 404 });
  }

  // Invite count
  const { count: inviteCount } = await supabase
    .from("game_invites")
    .select("id")
    .eq("game_id", data.id)
    .eq("status", "pending");

  // Registrants
  const { data: registered } = await supabase
    .from("game_registrations")
    .select("id")
    .eq("game_id", data.id);
  
  const pendingRegistrants = registered?.filter((reg: any) => reg.status === "pending");
  const confirmedRegistrants = registered?.filter((reg: any) => reg.status === "confirmed");

  const gameData: GMGameDO = {
    id: data.id,
    title: data.title,
    description: data.description,
    system: data.system,
    coverImage: data.cover_image,
    gameCode: data.game_code,
    scheduled_next: data.game_schedule[0].next_game_date,
    interval: data.game_schedule[0].interval,
    dow: data.game_schedule[0].day_of_week,
    maxSeats: data.max_seats,
    status: data.status,
    schedStatus: data.game_schedule[0].status,
    location_id: data.game_schedule[0].location_id,
    location: data.game_schedule[0].location,
    visibility: data.visibility,
    invites: inviteCount ?? 0,
    pending: pendingRegistrants?.length ?? 0,
    registered: confirmedRegistrants?.length ?? 0,
    gamemaster: data.gamemaster
  }

  return NextResponse.json(gameData);
}
