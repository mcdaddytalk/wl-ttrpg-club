// import { ContactListDO } from "@/lib/types/custom";
import { MemberDO, SupabaseMemberListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
  
    const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select(`
            id,
            email,
            phone,
            provider,
            is_admin,
            is_minor,
            profiles!inner(
                given_name,
                surname,
                avatar
            ),
            member_roles!inner(
                roles!inner(
                    name
                )
            )
        `) as unknown as SupabaseMemberListResponse;
        // ;

    if (memberError) {
        logger.error(memberError)
        return NextResponse.json({ message: memberError.message }, { status: 500 });
    }

    if (!memberData) {
        return NextResponse.json({ message: 'No members found' }, { status: 404 });
    }
    
    const memberList: MemberDO[] = memberData.map((member) => ({
        id: member.id,
        provider: member.provider || '',
        given_name: member.profiles.given_name!,
        surname: member.profiles.surname!,
        displayName: `${member.profiles.given_name} ${member.profiles.surname}`,
        email: member.email,
        phone: member.phone || '',
        isMinor: member.is_minor,
        isAdmin: member.is_admin,
        consent: member.consent,
        status: member.status,
        last_login_at: member.last_login_at,
        created_at: member.created_at,
        updated_at: member.updated_at,
        deleted_at: member.deleted_at,
        updated_by: member.updated_by,
        deleted_by: member.deleted_by,
        avatar: member.profiles.avatar || 'default',
        roles: member.member_roles.map((role) => role.roles),        
    }));

    memberList.sort((a, b) => a.surname.localeCompare(b.surname));
  // logger.log('Contact list:', memberList);

    return NextResponse.json(memberList, { status: 200 });
  }