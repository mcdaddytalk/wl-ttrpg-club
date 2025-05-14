import { serializeGMGameData } from "@/lib/serializers/gamemaster/serializeGMGameData";
import { GMGameDataListResponse } from "@/lib/types/custom"; // Import the GMGameData
import { GMGameDO } from "@/lib/types/data-objects";
import logger from "@/utils/logger";
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

    const gm_id = user.id;

    const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select(`
            id,
            title,
            description,
            system,
            max_seats,
            starting_seats,
            cover_image,
            game_code,
            status,
            visibility,
            created_at,
            deleted_at,
            gamemaster_id,
            gamemaster: members!fk_games_members (
                id,
                email,
                profiles (
                    given_name,
                    surname,
                    avatar
                )
            ),
            game_schedule (
                id,
                game_id,
                status,
                interval,
                first_game_date,
                next_game_date,
                last_game_date,
                day_of_week,
                deleted_at,
                location_id,
                location: locations!game_schedule_location_id_fkey(*)
            ),            
            game_invites!game_invites_game_id_fkey (
                *
            ),
            game_registrations!fk_game_registrations_games (
                *
            )            
        `)
        .eq('gamemaster_id', gm_id)
        .order('created_at', { ascending: false }) as unknown as GMGameDataListResponse;

    if (gameError) {
        logger.error(gameError)
        return NextResponse.json({ message: gameError.message }, { status: 500 });
    }

    if (!gameData) {
        return NextResponse.json([], { status: 200 });
    }

    const gmGames: GMGameDO[] = gameData.map(serializeGMGameData);

    return NextResponse.json(gmGames);
}