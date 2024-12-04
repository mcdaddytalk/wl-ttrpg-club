import { RoleDO } from "@/lib/types/custom";
import { fetchRoles } from "@/queries/fetchMembers";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    
    const supabase = await createSupabaseServerClient();
    const { data: roleData, error: rolesError } = await fetchRoles(supabase);

    if (rolesError) {
        console.error(rolesError)
        return NextResponse.json({ message: rolesError.message }, { status: 500 });
    }

    const roles = roleData as RoleDO[] || [];
    return NextResponse.json(roles, { status: 200 });
}