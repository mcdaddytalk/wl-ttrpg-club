import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
          return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  
  const supabase = await createSupabaseServerClient();

  const { data, count } = await supabase
    .from('announcements')
    .select('title, created_at', { count: 'exact' })
    .is('approved_by', null)
    .order('created_at', { ascending: false })
    .limit(1);

  return NextResponse.json({
    count: count ?? 0,
    latestTitle: data?.[0]?.title ?? 'No title',
    latestCreatedAt: data?.[0]?.created_at ?? new Date(0).toISOString(),
  });
}