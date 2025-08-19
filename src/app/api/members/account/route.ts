import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
                    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    
    const supabase = await createSupabaseServerClient();
    
    // 1) Auth user + identities
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const identities = user?.identities ?? [];
    const hasPassword = identities.some(i => i.provider === 'email');
    const providers = identities.map(i => ({ id: i.identity_id, provider: i.provider }));

    // 2) Member status
    const { data: member, error } = await supabase
        .from('members')
        .select('id,email,status,deleted_at,deletion_requested_at,deleted_by,last_login_at')
        .eq('id', user.id)
        .single();

    if (error) {
        logger.error(error)
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const data = {
        member,
        hasPassword,
        providers,
    }
    
    return NextResponse.json(data);
}