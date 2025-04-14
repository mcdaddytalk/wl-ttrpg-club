import { TagDO } from '@/lib/types/custom';
import logger from '@/utils/logger';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    
    const supabase = await createSupabaseServerClient();

    const { data: tags, error: tagError } = await supabase
        .from('tags')
        .select('id, name')
        .order('name', { ascending: true });

    if (tagError) {
        logger.error(tagError);
        return NextResponse.json({ error: tagError.message }, { status: 500 });
    }

    const { data: counts, error: countError } = await (
      supabase
        .from('admin_task_tags')
        .select('tag_id, count:count(*)')
        // @ts-expect-error: group is valid PostgREST param but not in supabase-js types
        .group('tag_id')
    );

    if (countError) {
        logger.error(countError);
        return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const countMap = new Map<string, number>(
      (counts ?? []).map(({ tag_id, count }: { tag_id: string; count: number }) => [tag_id, count])
    );

    const tagsWithCount: TagDO[] = (tags ?? []).map(tag => ({
        id: tag.id,
        name: tag.name,
        task_count: countMap.get(tag.id) ?? 0
    }));

    const sorted = tagsWithCount.sort((a, b) => {
        if (a.task_count !== b.task_count) {
            return b.task_count - a.task_count; // Desc by count
        }
        return a.name.localeCompare(b.name); // Asc by name
    });

    return NextResponse.json(sorted);
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
