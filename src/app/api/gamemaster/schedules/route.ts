import { SupabaseGameDataListResponse } from "@/lib/types/custom"
import { GMGameScheduleDO } from "@/lib/types/data-objects"
import logger from "@/utils/logger"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data: games, error: gamesError } = await supabase
        .from("games")
        .select(`
            id,
            title,
            system,
            description,
            visibility,
            cover_image,
            gamemaster_id,
            deleted_at
        `)
        .eq("gamemaster_id", user.id)
        .is("deleted_at", null);

    if (gamesError) {
        logger.error("Failed to fetch games", gamesError)
        return NextResponse.json({ message: gamesError.message }, { status: 500 })
    }

    const gameIds = games.map((game) => game.id)

    const { data: scheduleData, error: scheduleError } = await supabase
        .from("game_schedule")
        .select(`
            id,
            status,
            interval,
            day_of_week,
            first_game_date,
            next_game_date,
            last_game_date,
            game_id,
            location:location_id (
                id,
                name,
                type,
                url,
                address,
                created_by,
                scope,
                created_at,
                updated_at
            )
        `)
        .in("game_id", gameIds)
        .is("deleted_at", null)
        .order("next_game_date", { ascending: true }) as unknown as SupabaseGameDataListResponse
        

    if (scheduleError) {
        logger.error("Failed to fetch game schedules", scheduleError)
        return NextResponse.json({ message: scheduleError.message }, { status: 500 })
    }

    if (!scheduleData) {
        return NextResponse.json([], { status: 200 })
    }
    
    const schedules: GMGameScheduleDO[] = (scheduleData).map((row) => {
        const game = games.find((game) => game.id === row.game_id)
        return {        
            game_id: row.game_id,
            game_title: game!.title,
            game_cover_image: game!.cover_image || "",
            schedule_status: row.status,
            interval: row.interval,
            first_game_date: row.first_game_date,
            next_game_date: row.next_game_date,
            last_game_date: row.last_game_date,
            day_of_week: row.day_of_week,
            location: row.location
        }
    })

    return NextResponse.json(schedules)
}
