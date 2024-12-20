import { TypedSupabaseClient } from "@/lib/types/custom";

export function fetchGamesByUser(supabase: TypedSupabaseClient, userid: string) {
    return supabase.from("games")
        .select(`
            id,
            title,
            description,
            system,
            image,
            max_seats,
            starting_seats,
            game_schedule (
                id,
                interval,
                day_of_week,
                first_game_date,
                next_game_date,
                last_game_date,
                status,
                location
            ),
            gamemaster_id,
            gamemaster:members!fk_games_members (
                id,
                profiles (
                    given_name,
                    surname,
                    avatar
                )
            ),
            game_registrations (
                member_id,
                members!fk_game_registrations_members (
                    id,
                    profiles (
                        given_name,
                        surname,
                        avatar
                    )
                )
            )
        `)
        .eq("game_registrations.member_id", userid);
}