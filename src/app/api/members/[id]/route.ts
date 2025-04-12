import { MemberDO, SupabaseMemberResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type MemberParams = {
    id: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<MemberParams> }): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select(`
            *,
            profiles (
                id,
                given_name,
                surname,
                phone,
                experience_level,
                avatar
            ),
            member_roles (
                roles (
                    id,
                    name
                )
            )
        `)
        .eq('id', id)
        .single() as unknown as SupabaseMemberResponse;

    if (memberError) {
        logger.error(memberError)
        return NextResponse.json({ message: memberError.message }, { status: 500 });
    }
    
    if (!memberData) {
        return NextResponse.json({ message: `Member not found` }, { status: 404 })
    }

    const memberDO: MemberDO = {
        id: memberData.id,
        provider: memberData.provider || '',
        given_name: memberData.profiles.given_name ?? '',
        surname: memberData.profiles.surname ?? '',
        displayName: `${memberData.profiles.given_name} ${memberData.profiles.surname}`,
        email: memberData.email,
        phone: memberData.phone || '',
        birthday: memberData.profiles.birthday ? new Date(memberData.profiles.birthday) : null,
        experienceLevel: memberData.profiles.experience_level,
        isAdmin: memberData.is_admin,
        isMinor: memberData.is_minor,
        created_at: memberData.created_at,
        updated_at: memberData.updated_at,
        bio: memberData.profiles.bio ?? '',
        avatar: memberData.profiles.avatar ?? '',
        roles: memberData.member_roles.map(role => role.roles),
        status: "pending",
        last_login_at: memberData.last_login_at,
        consent: memberData.consent,
        updated_by: memberData.updated_by,
        deleted_at: memberData.deleted_at,
        deleted_by: memberData.deleted_by
    }
    
    return NextResponse.json(memberDO, { status: 200 })
}   