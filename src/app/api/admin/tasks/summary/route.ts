import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
          return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  
  const supabase = await createSupabaseServerClient();
  
  const [roleRequests, verifications, gmApprovals, memberApprovals] = await Promise.all([
    supabase.from('member_roles').select('*', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('verified', false).is('deleted_at', null),
    supabase.from('games').select('*', { count: 'exact', head: true }).is('approved', false),
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('approved', false).is('deleted_at', null),
  ]);

  const pendingTasks =
    (roleRequests.count ?? 0) +
    (verifications.count ?? 0) +
    (gmApprovals.count ?? 0) +
    (memberApprovals.count ?? 0);

  return NextResponse.json({
    pendingTasks,
    roleRequests: roleRequests.count ?? 0,
    verifications: verifications.count ?? 0,
    gmApprovals: gmApprovals.count ?? 0,
    memberApprovals: memberApprovals.count ?? 0,
  });
}