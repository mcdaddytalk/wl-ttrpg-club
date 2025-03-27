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
  
    const { data: gamemasterData, error: gamemasterError } = await supabase
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
        `)
        .eq('member_roles.roles.name', 'gamemaster') as unknown as SupabaseMemberListResponse;
        // ;

    if (gamemasterError) {
        logger.error(gamemasterError)
        return NextResponse.json({ message: gamemasterError.message }, { status: 500 });
    }

    if (!gamemasterData) {
        return NextResponse.json({ message: 'No gamemasters found' }, { status: 404 });
    }
    
    const gamemasterList: MemberDO[] = gamemasterData.map((gamemaster) => ({
        id: gamemaster.id,
        provider: gamemaster.provider || '',
        given_name: gamemaster.profiles.given_name!,
        surname: gamemaster.profiles.surname!,
        displayName: `${gamemaster.profiles.given_name} ${gamemaster.profiles.surname}`,
        email: gamemaster.email,
        phone: gamemaster.phone || '',
        isMinor: gamemaster.is_minor,
        isAdmin: gamemaster.is_admin,
        avatar: gamemaster.profiles.avatar || 'default',
        roles: gamemaster.member_roles.map((role) => role.roles),        
    }));

    gamemasterList.sort((a, b) => a.surname.localeCompare(b.surname));
  // logger.log('Contact list:', gamemasterList);

    return NextResponse.json(gamemasterList, { status: 200 });
  }