import { TypedSupabaseClient } from "@/lib/types/custom";

export function fetchRegistrants(supabase: TypedSupabaseClient) {
    return supabase.from("game_registrations")
        .select(`
            game_id,
            member_id,
            status,
            status_note
        `);
}