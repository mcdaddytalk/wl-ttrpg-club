import { MemberData } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: memberData, error: memberError } = await supabase
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
        .order("created_at", { ascending: false });

    if (memberError) {
        console.error(memberError)
        return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    const members = memberData as unknown as MemberData[] || [];

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
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`
    });
    if (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Email invite sent!` }, { status: 200 })
}