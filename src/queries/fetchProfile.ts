import { TypedSupabaseClient } from "@/lib/types/custom";

export const fetchProfile = async (supabase: TypedSupabaseClient, userId: string) => {
    return await supabase.from('profiles').select('*').eq('id', userId).single();
    // return profile;
}