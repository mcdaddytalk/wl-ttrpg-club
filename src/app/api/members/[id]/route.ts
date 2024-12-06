import { SupabaseMemberResponse } from "@/lib/types/custom";
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
            id,
            email,
            is_minor,
            profiles (
                id,
                given_name,
                surname,
                phone,
                experience_level,
                avatar
            )        
        `)
        .eq('id', id)
        .single() as unknown as SupabaseMemberResponse;

    if (memberError) {
        console.error(memberError)
        return NextResponse.json({ message: memberError.message }, { status: 500 });
    }
    
    if (!memberData) {
        return NextResponse.json({ message: `Member not found` }, { status: 404 })
    }
    
    return NextResponse.json(memberData, { status: 200 })
}   