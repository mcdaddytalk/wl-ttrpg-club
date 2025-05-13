import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import { GetGamesSchema } from "@/app/admin/_lib/adminGames";
import { GMGameDataListResponse } from "@/lib/types/custom";


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
            starting_seats,
            visibility,
            deleted_at,
            created_at,
            game_schedule(
                first_game_date,
                next_game_date,
                last_game_date,
                location_id,
                location:locations(
                    name
                )
            ),
            gamemaster:members!fk_games_members(
                id,
                email,
                profiles(
                    given_name, 
                    surname
                )
            ),
            game_registrations(id)
        `,
        { count: "exact" }
        )
        .range(offset, offset + pageSize - 1);
        
    if (sort) {
        sort.forEach(({ id, desc }: { id: string, desc: boolean }) => {
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

    const { data, error, count } = await query as unknown as GMGameDataListResponse;

    if (error) throw error;
    
    // Transform registrations into a player count
    const transformed = data.map((game) => ({
        id: game.id,
        title: game.title,
        description: game.description,
        system: game.system,
        status: game.status,
        coverImage: game.cover_image,
        maxSeats: game.max_seats,
        startingSeats: game.starting_seats,
        visibility: game.visibility,
        location_id: game.game_schedule[0]?.location_id || null,
        location_name: game.game_schedule[0]?.location?.name || null,
        player_count: game.game_registrations?.length || 0,
        gm_id: game.gamemaster?.id || null,
        gm_name: `${game.gamemaster?.profiles?.given_name ?? "—"} ${game.gamemaster?.profiles?.surname ?? ""}`.trim(),
        next_session_at: game.game_schedule[0]?.next_game_date || null,
    }));
    
    return NextResponse.json({ games: transformed, count }, { status: 200 });
}