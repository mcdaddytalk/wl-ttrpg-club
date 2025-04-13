import { MemberDO, SupabaseMemberResponse } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: `Member ID is required` }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient();

    const { data: memberData, error } = await supabase
        .from('members')
        .select(`
            id, email, phone, provider, status, is_admin, is_minor, consent, created_at, updated_at, last_login_at,
            deleted_at, updated_by, deleted_by,
            profiles(*),
            member_roles(
                roles(
                    id,
                    name
                )
            ),
            admin_notes(id, author_id, note, created_at)
        `)
        .eq('id', id)
        .single() as unknown as SupabaseMemberResponse;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const member: MemberDO = {
            id: memberData.id,
            email: memberData.email,
            provider: memberData.provider ?? '',
            phone: memberData.phone ? memberData.phone : memberData.profiles.phone ?? '',
            given_name: memberData.profiles.given_name ?? '',
            surname: memberData.profiles.surname ?? '',
            displayName: `${memberData.profiles.given_name} ${memberData.profiles.surname}`,
            birthday: memberData.profiles.birthday ? new Date(memberData.profiles.birthday) : null,
            experienceLevel: memberData.profiles.experience_level,
            isAdmin: memberData.is_admin,
            isMinor: memberData.is_minor,
            status: memberData.status,
            consent: memberData.consent,
            last_login_at: memberData.last_login_at,
            created_at: memberData.created_at,
            updated_at: memberData.updated_at,
            deleted_at: memberData.deleted_at,
            updated_by: memberData.updated_by,
            deleted_by: memberData.deleted_by,
            bio: memberData.profiles.bio ?? '',
            avatar: memberData.profiles.avatar ?? '',
            admin_notes: memberData.admin_notes,
            roles: memberData.member_roles.map(role => role.roles)
        }

    return NextResponse.json(member);
}