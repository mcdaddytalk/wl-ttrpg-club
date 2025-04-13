import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import { GetGamesSchema } from "@/app/admin/_lib/adminGames";
import { SupabaseGMGameDataListResponse } from "@/lib/types/custom";


export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select(`
            *,
            game_perms(
                gamemaster_id,
                members(
                    email,
                    profiles (
                        given_name,
                        surname
                    )
                )
            )  
        `);

    if (gamesError) {
        logger.error(gamesError);
        return NextResponse.json({ message: 'Error fetching games' }, { status: 500 });
    }        

    if (!gamesData) {
        return NextResponse.json({ message: 'Games not found' }, { status: 404 });
    }

    return NextResponse.json(gamesData);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json() as GetGamesSchema;

    const { 
        search, 
        page, 
        pageSize, 
        sort, 
        status,
        system, 
        archived,
        from,
        to
    } = body;

    const offset = (page - 1) * pageSize;
    
    const supabase = await createSupabaseServerClient();
    let query = supabase
        .from("games")
        .select(
        `
            id,
            title,
            description,
            system,
            status,
            cover_image,
            max_seats,
            starting,seats,
            visibility,
            deleted_at,
            created_at,
            game_schedule(next_session_at),
            gamemaster:members(
                id,
                email,
                profiles(
                    given_name, 
                    surname
                ),
            ),
            game_registrations(id)
        `,
        { count: "exact" }
        )
        .range(offset, offset + pageSize - 1);
        
    if (sort) {
        sort.forEach(({ id, desc }) => {
            query = query.order(id, { ascending: !desc });
        })
    }

    if (search) {
        query = query.ilike("title", `%${search}%`);
    }

    if (system.length) {
        query = query.in("system", system);
    }

    if (status.length) {
        query = query.in("status", status);
    }

    if (!archived) {
        query = query.is("deleted_at", null);
    }

    if (from) {
        query = query.gte("game_schedule.next_session_at", from);
    }

    if (to) {
        query = query.lte("game_schedule.next_session_at", to);
    }

    const { data, error, count } = await query as unknown as SupabaseGMGameDataListResponse;

    if (error) throw error;

    // Transform registrations into a player count
    const transformed = data.map((game) => ({
        ...game,
        player_count: game.game_registrations?.length || 0,
        gm_name: `${game.gamemaster?.profiles?.given_name ?? "—"} ${game.gamemaster?.profiles?.surname ?? ""}`.trim(),
        next_session_at: game.game_schedule[0]?.next_game_date || null,
    }));
    
    return NextResponse.json({ games: transformed, count }, { status: 200 });
}