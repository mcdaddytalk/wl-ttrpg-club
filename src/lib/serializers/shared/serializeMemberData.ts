import { MemberDO } from "@/lib/types/data-objects";

export function serializeMemberData(member: any): MemberDO {
  return {
    id: member.id,
    status: member.status,
    email: member.email,
    phone: member.phone ?? null,
    provider: member.provider,
    isAdmin: !!member.is_admin,
    isMinor: !!member.is_minor,
    created_at: member.created_at,
    updated_at: member.updated_at,
    last_login_at: member.last_login_at,
    consent: member.consent,
    updated_by: member.updated_by,
    deleted_at: member.deleted_at,
    deleted_by: member.deleted_by,
    given_name: member.profiles?.given_name,
    surname: member.profiles?.surname,
    displayName: `${member.profiles?.given_name} ${member.profiles?.surname}`,
    birthday: member.profiles?.birthday,
    bio: member.profiles?.bio,
    avatar: member.profiles?.avatar,
    experienceLevel: member.profiles?.experience_level ?? "new",
    roles: member.member_roles?.map((mr: any) => ({
      role_id: mr.role_id,
      member_id: mr.member_id,
      roles: {
        id: mr.roles?.id,
        name: mr.roles?.name,
      },
    })) ?? [],
  };
}
