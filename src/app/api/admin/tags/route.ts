import { SupabaseTagListResponse, TagDO } from '@/lib/types/custom';
import logger from '@/utils/logger';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('tags')
        .select(`
            id, 
            name, 
            admin_task_tags(count)
        `)
        .order('name', { ascending: true }) as unknown as SupabaseTagListResponse;

    if (error) {
        logger.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        logger.error('Failed to fetch tags');
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }

    const sorted = (data ?? []).sort((a, b) => {
        const countA = a.admin_task_tags[0]?.count ?? 0;
        const countB = b.admin_task_tags[0]?.count ?? 0;
      
        if (countA !== countB) {
          return countB - countA; // Descending by count
        }
      
        return a.name.localeCompare(b.name); // Ascending by name
    });

    const tags: TagDO[] = sorted.map((tag) => ({
        id: tag.id,
        name: tag.name,
        task_count: tag.admin_task_tags[0].count ?? 0
    }))
    
    return NextResponse.json(tags);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { name } = await request.json();

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('tags')
    .insert([{ name: name.toLowerCase().trim() }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
