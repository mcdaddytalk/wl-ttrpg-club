import { MemberData, RoleDO, TypedSupabaseClient } from "@/lib/types/custom";
import { queryOptions } from "@tanstack/react-query";
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

export const fetchMembersFull = () => {
    return queryOptions({
        queryKey: ['admin', 'members', 'full'],
        queryFn: async () => {
            const response = await fetch("/api/admin/members",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch members");
            const data = await response.json();
            return data as MemberData[];
        }
    })
}

export const fetchRoles = () => {
    return queryOptions({
        queryKey: ['all', 'roles'],
        queryFn: async () => {
            const response = await fetch("/api/roles",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch roles");
            const data = await response.json();
            return data as RoleDO[];
        }
    })
}