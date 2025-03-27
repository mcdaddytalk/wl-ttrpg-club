import { GetMembersSchema } from "@/app/admin/_lib/validations";
import { MemberData, MemberDO, SupabaseMemberListResponse } from "@/lib/types/custom";
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
            created_at: memberData.created_at,
            updated_at: memberData.updated_at,
            bio: memberData.profiles.bio ?? '',
            avatar: memberData.profiles.avatar ?? '',        
            roles: memberData.member_roles.map(role => role.roles)
        }
    }) || [];

    return NextResponse.json( members, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json() as GetMembersSchema;
    const { page, perPage, sort, email, experienceLevel, isAdmin, isMinor }  = body;

    const supabase = await createSupabaseServerClient();
    let query = supabase
        .from("members")
        .select(`
            *,
            profiles!inner(
                given_name,
                surname,
                avatar,
                experience_level,
                bio,
                birthday,
                avatar
            ),
            member_roles(
                roles(
                    id,
                    name
                )
            )
        `, { count: "exact" })
        .range((page - 1) * perPage, page * perPage - 1);

    if (sort) {
        sort.forEach(({ id, desc }) => {
            query = query.order(id, { ascending: !desc });
        })
    }

    // Apply filters
    if (email) query = query.ilike("email", `%${email}%`);
    if (experienceLevel && experienceLevel.length) query = query.in("profiles.experience_level", experienceLevel);
    if (isAdmin) query = query.eq("is_admin", isAdmin);
    if (isMinor) query = query.eq("is_minor", isMinor);

    const { data: membersData, error, count } = await query;
    
    if (error) {
        logger.error('Error fetching members with params:',   error)
        return NextResponse.json({ error }, { status: 500 });
    }

    if (!membersData) {
        logger.debug('No members found');
        return NextResponse.json({ members: [], count: 0 }, { status: 200 });
    }
        
    const members: MemberDO[] = (membersData as unknown as MemberData[]).map((memberData) => {
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
                created_at: memberData.created_at,
                updated_at: memberData.updated_at,
                bio: memberData.profiles.bio ?? '',
                avatar: memberData.profiles.avatar ?? '',        
                roles: memberData.member_roles.map(role => role.roles)
            }
        });

    return NextResponse.json({ members, count }, { status: 200 })
}