import { SupabaseGameDataListResponse, SupabaseGameRegistrationListResponse, SupaGameScheduleData, UpcomingGame } from "@/lib/types/custom";
import { fetchRegistrants } from "@/queries/fetchRegistrants";
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
    const supabase = await createSupabaseServerClient();

    const { data: gameData, error: gameError } = await supabase
        .from('game_schedule')
        .select(`
            id,
            game_id,
            interval,
            day_of_week,
            first_game_date,
            next_game_date,
            last_game_date,
            status,
            location,
            games (
                id,
                title,
                description,
                system,
                image,
                max_seats,
                gamemaster_id,
                gamemaster:members!fk_games_members (
                    id,
                    email,
                    profiles (
                        given_name,
                        surname,
                        avatar
                    )
                ),
                registrants:game_registrations!fk_game_registrations_members (
                    member_id,
                    registered_at,
                    status,
                    status_note
                )
            )
        `)
        .gt('next_game_date', new Date().toISOString()) as unknown as SupabaseGameDataListResponse;
    
    console.log('UpcomingGame data:', gameData);

    if (gameError) {
        console.error(gameError)
        return NextResponse.json({ message: gameError.message }, { status: 500 });
    }

    const { data: gameRegistrants, error: gameRegistrantsError } = await fetchRegistrants(supabase) as unknown as SupabaseGameRegistrationListResponse;

    if (gameRegistrantsError) {
        console.error(gameRegistrantsError)
        return NextResponse.json({ message: gameRegistrantsError.message }, { status: 500 });
    }

    console.log('Game Registrants:  ', gameRegistrants);

    const gameIds = gameRegistrants?.map((gameRegistrant) => {
        if (gameRegistrant.member_id == id) return gameRegistrant.game_id;
        return null;
    }).filter((gameId) => gameId !== null);

    console.log('Game Ids:  ', gameIds);

    const upcomingGames: UpcomingGame[] = gameData?.filter(
            (gameSchedule: SupaGameScheduleData) => gameIds.includes(gameSchedule.game_id)
        )
        .map(
            (game: SupaGameScheduleData) => {
                return {
                    id: game.game_id,
                    title: game.games.title,
                    description: game.games.description,
                    system: game.games.system,
                    image: game.games.image,
                    scheduled_for: new Date(game.next_game_date) || null,
                    status: game.status,
                    num_players: game.games.registrants.length,
                    gm_name: game.games.gamemaster.profiles.given_name + ' ' + game.games.gamemaster.profiles.surname,
                    gm_member_id: game.games.gamemaster.id,
                    registered: true,
                    registration_date: game.games.registrants.find((registrant) => registrant.member_id === id)?.registered_at || null
                }
            }
        )

    return NextResponse.json(upcomingGames, { status: 200 })

}