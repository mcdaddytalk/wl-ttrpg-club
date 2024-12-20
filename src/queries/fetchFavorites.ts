import { TypedSupabaseClient } from "@/lib/types/custom";

export function fetchFavorites(supabase: TypedSupabaseClient) {
    return supabase.from("game_favorites")
        .select(`
            game_id,
            member_id,
            created_at
        `);
}