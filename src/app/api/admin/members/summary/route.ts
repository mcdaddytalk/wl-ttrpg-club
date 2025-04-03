import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [ totalMembers, activeThisWeek, activeThisMonth, newSignups ] = await Promise.all([
        supabase.from('members')
            .select('*', { count: 'exact', head: true })
            .is('deleted_at', null),
        supabase.from('members')
            .select('*', { count: 'exact', head: true })
            .gte('updated_at', oneWeekAgo.toISOString())
            .is('deleted_at', null),
        supabase.from('members')
            .select('*', { count: 'exact', head: true })
            .gte('updated_at', oneMonthAgo.toISOString())
            .is('deleted_at', null),
        supabase.from('members')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', oneWeekAgo.toISOString())
            .is('deleted_at', null),
    ])
  
    return NextResponse.json({
        totalMembers: totalMembers.count ?? 0,
        activeThisWeek: activeThisWeek.count ?? 0,
        activeThisMonth: activeThisMonth.count ?? 0,
        newSignups: newSignups.count ?? 0,
    });
}