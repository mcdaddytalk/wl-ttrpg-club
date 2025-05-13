import { RoleDO } from "@/lib/types/data-objects";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    
    const supabase = await createSupabaseServerClient();
    const { data: roleData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name', { ascending: true });

    if (rolesError) {
        logger.error(rolesError)
        return NextResponse.json({ message: rolesError.message }, { status: 500 });
    }

    const roles = roleData as RoleDO[] || [];
    return NextResponse.json(roles, { status: 200 });
}