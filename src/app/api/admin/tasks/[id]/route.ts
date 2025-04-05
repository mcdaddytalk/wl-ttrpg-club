import { NextRequest, NextResponse } from 'next/server';
import { TaskUpdateSchema, TaskFilterSchema } from '@/lib/validation/tasks';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { AdminTaskTagData, SupabaseTaskResponse, TagData, TaskData, TaskDO } from '@/lib/types/custom';
import logger from '@/utils/logger';

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const parse = TaskFilterSchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: parse.error }, { status: 400 });
  }
  
  const { id } = await params;

  const supabaseAdmin = await createSupabaseServerClient();
  const { data, error } = await supabaseAdmin
    .from('admin_tasks')
    .select(`*,
      assigned_to_user:members!admin_tasks_assigned_to_fkey(
        id,
        profiles (
          given_name,
          surname
        )
      ), 
      admin_task_tags(tag_id),
      tags(name)
    `)
    .eq('id', id)
    .maybeSingle() as unknown as SupabaseTaskResponse;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  
  const { assigned_to, assigned_to_user, admin_task_tags, tags, ...rest } = data;

  const task: TaskDO = {
        ...rest,
        assigned_to: {
          id: assigned_to ?? null,
          given_name: assigned_to_user?.profiles.given_name ?? null,
          surname: assigned_to_user?.profiles.surname ?? null,
          displayName: `${assigned_to_user?.profiles.given_name} ${assigned_to_user?.profiles.surname}`.trim() ?? null,
        },
        admin_task_tags: admin_task_tags.map((tag) => tag.tag_id) as unknown as AdminTaskTagData[],
        tags: tags.map((tag) => tag.name) as unknown as TagData[],
  };

  logger.debug('GET /api/admin/tasks/:id', task);
  
  return NextResponse.json(task);
}

type UpdatedTask = Partial<Omit<TaskData, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at' | 'assigned_to_user' | 'tags' | 'admin_task_tags'>> & {
  updated_at?: string;
};
export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
  const { id } = await params;
  const body = await request.json();
  const parse = TaskUpdateSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid update payload', details: parse.error }, { status: 400 });
  }

  const { assigned_to, due_date, tags = [], description, ...updateData } = parse.data;

  const payload: UpdatedTask = {
    ...updateData,
    updated_at: new Date().toISOString(),
    assigned_to: assigned_to ?? null,
    due_date: due_date ?? null,
    description: description ?? null,
  };

  const supabaseAdmin = await createSupabaseServerClient();
  const { data: task, error: updateError } = await supabaseAdmin
    .from('admin_tasks')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (updateError || !task) {
    return NextResponse.json({ error: updateError?.message || 'Failed to update task' }, { status: 500 });
  }

  // Clear existing links
  const { error: deleteError } = await supabaseAdmin
    .from('admin_task_tags')
    .delete()
    .eq('task_id', id);

  if (deleteError) {
    return NextResponse.json({ error: 'Failed to clear existing tags', details: deleteError }, { status: 500 });
  }

  // Upsert new tags
  const tagNames = [...new Set(tags?.map((t) => t.toLowerCase().trim()))];

  const { error: tagInsertError } = await supabaseAdmin
    .from('tags')
    .upsert(tagNames.map((name) => ({ name })), { onConflict: 'name' });

  if (tagInsertError) {
    return NextResponse.json({ error: 'Failed to upsert tags', details: tagInsertError }, { status: 500 });
  }

  const { data: tagRecords, error: tagFetchError } = await supabaseAdmin
    .from('tags')
    .select('id')
    .in('name', tagNames);

  if (tagFetchError || !tagRecords) {
    return NextResponse.json({ error: 'Failed to fetch tag IDs' }, { status: 500 });
  }

  const tagLinks = tagRecords.map((tag) => ({
    task_id: id,
    tag_id: tag.id,
  }));

  const { error: linkError } = await supabaseAdmin
    .from('admin_task_tags')
    .insert(tagLinks);

  if (linkError) {
    return NextResponse.json({ error: 'Failed to re-link tags to task' }, { status: 500 });
  }

  return NextResponse.json(task);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
  const { id } = await params;

  const supabaseAdmin = await createSupabaseServerClient();
  const { error } = await supabaseAdmin
    .from('admin_tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}