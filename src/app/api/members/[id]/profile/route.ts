import { SupabaseProfileResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type ProfileParams = {
    id: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<ProfileParams> }): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select("*")
        .eq('id', id)
        .single() as unknown as SupabaseProfileResponse;

    if (profileError) {
        logger.error(profileError)
        return NextResponse.json({ message: profileError.message }, { status: 500 });
    }
    
    if (!profileData) {
        return NextResponse.json({ message: `Member not found` }, { status: 404 })
    }

    return NextResponse.json(profileData, { status: 200 })
}   