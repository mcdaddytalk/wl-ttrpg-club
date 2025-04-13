import { NextResponse, NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import logger from '@/utils/logger';


export async function GET( request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: auditData, error: auditError } = await supabase
    .from("audit_trail")
    .select(`
      id,
      action,
      actor_id,
      target_type,
      target_id,
      summary,
      metadata,
      created_at,
      actor:actor_id (
        id,
        email,
        profiles (
          given_name,
          surname
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100);
    
    if (auditError) {
        logger.error('Error fetching audit log:', auditError);
        return NextResponse.json({ error: 'Error fetching audit log' }, { status: 500 });
    }

    return NextResponse.json(auditData);
}