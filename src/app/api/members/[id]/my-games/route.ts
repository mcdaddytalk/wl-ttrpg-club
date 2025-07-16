import { GameSchedStatus, GameVisibility, Location, RegisteredGameDO } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


type MemberParams = {
    id: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<MemberParams> }): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const userId = request.headers.get("x-user-id");

    const url = new URL(request.url);
    const startDate = url.searchParams.get("start");
    const endDate = url.searchParams.get("end");

    if (!userId || userId !== id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    let query = supabase
        .from("game_registrations")    
        .select(`
            game_id,
            status, 
            games(
                id, 
                title, 
                description,
                system, 
                cover_image, 
                gamemaster_id,
                gamemaster: members!fk_games_members (
                    id,
                    profiles(
                        given_name,
                        surname
                    )
                ),
                visibility, 
                game_schedule!fk_game_schedule_games(
                    game_id, 
                    first_game_date, 
                    next_game_date, 
                    interval, 
                    day_of_week, 
                    status,
                    locations (
                        id,
                        name,
                        address,
                        url,
                        type
                    ) 
                )
            )
        `)
        .eq("member_id", userId)
        .is("games.deleted_at", null);

    if (startDate && endDate) {
        query = query
            .gte("games.game_schedule.next_game_date",  startDate)
            .lte("games.game_schedule.next_game_date", endDate)
            .not("games.game_schedule", "is", null);
    }

    const { data: gamesData, error: gamesError } = await query;

    if (gamesError) {
        logger.error(gamesError)
        return NextResponse.json({ message: gamesError.message }, { status: 500 });
    }

    if (!gamesData) {
        return NextResponse.json({ message: 'No games found' }, { status: 404 });
    }

    logger.debug(gamesData[0].games)

    const myGames: RegisteredGameDO[] = gamesData.filter((gr) => gr.games !== null).map((gr) => ({
        id: gr.games.id,
        title: gr.games.title,
        description: gr.games.description ?? '',
        system: gr.games.system ?? '',
        visibility: (gr.games.visibility ?? 'public') as GameVisibility,
        coverImage: gr.games.cover_image ?? '',
        scheduled_for: gr.games.game_schedule[0].next_game_date ?? null,
        status: (gr.games.game_schedule[0].status ?? '') as GameSchedStatus,
        location: (gr.games.game_schedule[0].locations ?? { id: '', name: '', address: '', url: '', type: ''}) as unknown as Location,
        gamemasterId: gr.games.gamemaster_id ?? '',
        interval: gr.games.game_schedule[0].interval,
        dayOfWeek: gr.games.game_schedule[0].day_of_week ?? 'sunday',
        gm_given_name: gr.games.gamemaster?.profiles?.given_name ?? '',
        gm_surname: gr.games.gamemaster?.profiles?.surname ?? ''
    }));

    return NextResponse.json(myGames, { status: 200 })
}