import { SupabaseMemberListResponse } from "@/lib/types/custom";
import { MemberDO } from "@/lib/types/data-objects";
import { ENVS } from "@/utils/constants/envs";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: membersData, error: membersError } = await supabase
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
            ),
            admin_notes(
                *
            )
        `)
        .order("created_at", { ascending: false }) as unknown as SupabaseMemberListResponse;

    if (membersError) {
        logger.error('Error fetching members:', membersError)
        return NextResponse.json({ error: membersError.message }, { status: 500 });
    }

    const members: MemberDO[] = membersData.map((memberData) => {
        const { id, email, phone, provider } = memberData;
        return {
            id,
            email,
            provider: provider ?? '',
            phone: phone ? phone : memberData.profiles.phone ?? '',
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
    }) || [];

    return NextResponse.json( members, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json();
    const { email, given_name, surname, is_minor } = body;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
            given_name,
            surname,
            displayName: `${given_name} ${surname}`,
            is_minor
        },
        redirectTo: `${ENVS.NEXT_PUBLIC_SITE_URL}/login`
    });
    if (error) {
        logger.error('Error sending email invite:',   error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Email invite sent!` }, { status: 200 })
}