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

export async function PATCH(request: NextRequest, { params }: { params: Promise<ProfileParams> }): Promise<NextResponse> {

    if (request.method !== 'PATCH') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await request.json()

    const { data, error } = await supabase
        .from("profiles")
        .upsert({
        ...payload,
        id: user.id,
        updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}