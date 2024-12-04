import { TypedSupabaseClient } from "@/lib/types/custom";
export function getMembers(supabase: TypedSupabaseClient) {
    return supabase
        .from("members")
        .select("*");
}

export function fetchContactList(supabase: TypedSupabaseClient) {
    return supabase
        .from("members")
        .select(`
            id,
            profiles!inner(
                given_name,
                surname
            )  
        `)
        .order("profiles.surname", { ascending: false });
}

export function fetchMembersFull(supabase: TypedSupabaseClient) {
    return supabase
        .from("members")
        .select(`
            *,
            profiles(
                id,
                given_name,
                surname,
                avatar,
                experience_level,
                bio,
                birthday,
                phone
            ),
            member_roles(
                roles(
                    id,
                    name
                )
            )
        `)
        .order("created_at", { ascending: false });
}

export function fetchRoles(supabase: TypedSupabaseClient) {
    return supabase
        .from("roles")
        .select("*");
}