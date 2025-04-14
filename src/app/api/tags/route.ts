import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase().trim();

  if (!q || q.length < 1) {
    return NextResponse.json([], { status: 200 }); // return empty list
  }

  const supabase = await createSupabaseServerClient();

  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, name')
    .ilike('name', `%${q}%`)
    .order('name')
    .limit(10);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch tags', details: error }, { status: 500 });
  }

  return NextResponse.json(tags);
}
