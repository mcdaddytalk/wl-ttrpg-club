import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
          return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('title, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}