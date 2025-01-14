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
                location:locations!game_schedule_location_id_fkey(
                    *
                )
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
                id,
                member_id,
                status,
                status_note,
                registered_at
            )
        `)
        .eq("game_registrations.member_id", userid);
}