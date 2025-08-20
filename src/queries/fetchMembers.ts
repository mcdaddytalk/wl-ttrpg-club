
import { GetMembersSchema } from "@/app/admin/_lib/adminMembers";
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

export async function fetchMembersWithParams(
  supabase: TypedSupabaseClient,
  params: GetMembersSchema
): Promise<{ members: MemberDO[]; count: number }> {
  const {
    page,
    pageSize,
    sort,
    email,
    experienceLevel,
    isAdmin,
    isMinor,
    status,
 //   filters,
  } = params;

  let query = supabase
    .from("members")
    .select("*, profiles(*), member_roles(roles(*))", { count: "exact" })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (sort?.length) {
    sort.forEach(({ id, desc }) => {
      query = query.order(id, { ascending: !desc });
    });
  }

  if (email) query = query.ilike("email", `%${email}%`);
  if (experienceLevel?.length)
    query = query.in("profiles.experience_level", experienceLevel);
  if (isAdmin !== undefined && isAdmin !== null)
    query = query.eq("is_admin", isAdmin === "true");
  if (isMinor !== undefined && isMinor !== null)
    query = query.eq("is_minor", isMinor === "true");
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  if (!data) return { members: [], count: 0 };

  const members: MemberDO[] = data.map((m: any) => ({
    id: m.id,
    email: m.email,
    provider: m.provider ?? "",
    phone: m.phone ?? m.profiles?.phone ?? "",
    given_name: m.profiles?.given_name ?? "",
    surname: m.profiles?.surname ?? "",
    displayName: `${m.profiles?.given_name ?? ""} ${m.profiles?.surname ?? ""}`,
    birthday: m.profiles?.birthday ? m.profiles.birthday : null,
    experienceLevel: m.profiles?.experience_level,
    isAdmin: m.is_admin,
    isMinor: m.is_minor,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
    updated_by: m.updated_by,
    bio: m.profiles?.bio ?? "",
    avatar: m.profiles?.avatar ?? "",
    roles: m.member_roles?.map((r: { roles: any; }) => r.roles) ?? [],
    status: m.status,
    consent: m.consent,
    last_login_at: m.last_login_at,
    deleted_at: m.deleted_at,
    deleted_by: m.deleted_by,
    deletion_requested_at: m.deletion_requested_at,
    deletion_reason: m.deletion_reason
  }));

  return { members, count: count ?? 0 };
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