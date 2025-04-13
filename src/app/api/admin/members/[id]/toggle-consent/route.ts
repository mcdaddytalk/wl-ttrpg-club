import { NextResponse, NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import logger from '@/utils/logger';

type Params = {
    id: string;
};

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    const { id } = await params;
    
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
        logger.error('Unauthorized');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { consent } = await request.json();

    logger.debug(`PATCH /api/admin/members/${id}/toggle-consent`, { consent });

    const { data, error } = await supabase
        .from('members')
        .update({ consent, updated_by: user.id })
        .eq('id', id)
        .select();

    if (error) {    
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logger.debug(`PATCH /api/admin/members/${id}/toggle-consent`, data);
    
    return NextResponse.json(data);
}   