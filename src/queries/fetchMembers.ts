// import { GetMembersSchema } from "@/app/admin/_lib/validations";
import { 
    // MemberData, 
    TypedSupabaseClient 
} from "@/lib/types/custom";
import { MemberDO, RoleDO } from "@/lib/types/data-objects";
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
            return data as MemberDO[];
        }
    })
}

// export const fetchMembersWithParams = async (params: GetMembersSchema) => {
//     const { page, pageSize, sort, email, experienceLevel, isAdmin, isMinor } = params;

//     let query = supabase
//         .from("members")
//         .select("*, profiles(*), member_roles(*)")
//         .range((page - 1) * pageSize, page * pageSize - 1);

//     if (sort) {
//         sort.forEach(({ id, desc }) => {
//             query = query.order(id, { ascending: !desc });
//         })
//     }

//     // Apply filters
//     if (email) query = query.ilike("email", `%${email}%`);
//     if (experienceLevel && experienceLevel.length) query = query.in("profiles.experience_level", experienceLevel);
//     if (isAdmin !== undefined) query = query.eq("is_admin", isAdmin);
//     if (isMinor !== undefined) query = query.eq("is_minor", isMinor);

//     const { data: membersData, error, count } = await query;
    
//     if (error) throw new Error(error.message);
//     if (!membersData) return { members: [], count: 0 };

//     const members: MemberDO[] = (membersData as unknown as MemberData[]).map((memberData) => {
//         const { id, email, phone, provider, createdAt, updatedAt } = memberData;
//         return {
//             id,
//             email,
//             provider: provider ?? '',
//             phone: phone ? phone : memberData.profiles.phone ?? '',
//             given_name: memberData.profiles.given_name ?? '',
//             surname: memberData.profiles.surname ?? '',
//             displayName: `${memberData.profiles.given_name} ${memberData.profiles.surname}`,
//             birthday: memberData.profiles.birthday ? new Date(memberData.profiles.birthday) : null,
//             experienceLevel: memberData.profiles.experience_level,
//             isAdmin: memberData.is_admin,
//             isMinor: memberData.is_minor,
//             createdAt,
//             updatedAt,
//             bio: memberData.profiles.bio ?? '',
//             avatar: memberData.profiles.avatar ?? '',        
//             roles: memberData.member_roles.map(role => role.roles)
//         }
//     });
//     return { members, count };
// }

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