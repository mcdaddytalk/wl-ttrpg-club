// GET (list tasks) and POST (create task)
import { NextRequest, NextResponse } from 'next/server';
import { TaskCreateSchema, TaskFilterSchema } from '@/lib/validation/tasks';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { AdminTaskTagData, SupabaseTaskListResponse, TagData, TaskData, TaskDO } from '@/lib/types/custom';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = TaskFilterSchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error }, { status: 400 });
  }

  logger.debug('GET /api/admin/tasks', parsed.data);

  const {
    tags,
    status,
    priority,
    search,
    assigned_to,
    due_before,
    include_archived,
  } = parsed.data;

  const supabaseAdmin = await createSupabaseServerClient();

  let query = supabaseAdmin
    .from('admin_tasks')
    .select(`
      *,
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
    .order('created_at', { ascending: false });

  if (!include_archived) query = query.is('deleted_at', null);
  if (status) query = query.eq('status', status);
  if (priority) query = query.eq('priority', priority);
  if (assigned_to) query = query.eq('assigned_to', assigned_to);
  if (due_before) {
    query = query.lte('due_date', due_before);
  }
  // if (due_after) {
  //   query = query.gte('due_date', due_after);
  // }
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  if (tags?.length) {
    const tagIds = (
      await supabaseAdmin.from('tags').select('id').in('name', tags)
    ).data?.map((t) => t.id) ?? [];
  
    logger.debug('tagIds', tagIds);

    if (tagIds.length) {
      query = query.in('admin_task_tags.tag_id', tagIds);
    }
  }

  const { data, error } = await query as unknown as SupabaseTaskListResponse;

  if (error) {
    logger.error('Failed to fetch tasks', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    logger.error('No tasks found');
    return NextResponse.json({ error: 'No tasks found' }, { status: 404 });
  }

  const tasks: TaskDO[] = data.map((task) => {
    const { assigned_to, assigned_to_user, admin_task_tags, tags, ...rest } = task;

    return {
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
  })


  return NextResponse.json(tasks);
}

type InsertableTask = Omit<TaskData, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'assigned_to_user' | 'tags' | 'admin_task_tags'>;

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = TaskCreateSchema.safeParse(body);
  
    if (!parsed.success) {
        logger.error('Invalid task data:', parsed.error);
        return NextResponse.json({ error: 'Invalid task data', details: parsed.error }, { status: 400 });
    }
    
    const supabaseAdmin = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabaseAdmin.auth.getUser();
    
    if (!user) {
        logger.error('Unauthorized');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tags = parsed.data.tags ?? [];
    
    const payload: InsertableTask = {
        ...parsed.data,
        created_by: user.id, // ensure it's set
        assigned_to: parsed.data.assigned_to ?? null,
        due_date: parsed.data.due_date ?? null,
        description: parsed.data.description ?? null,
    };

    logger.info('Inserting task:', payload);

    const { data: task, error: taskError } = await supabaseAdmin
      .from('admin_tasks')
      .insert(payload)
      .select()
      .single();
  
    if (taskError) {
        logger.error('Error inserting task:', taskError);
        return NextResponse.json({ error: taskError.message }, { status: 500 });
    }
    
    // Step 2: Upsert tags
    const tagNames = [...new Set(tags.map((t) => t.toLowerCase().trim()))];

    const { error: tagInsertError } = await supabaseAdmin
      .from('tags')
      .upsert(tagNames.map((name) => ({ name })), { onConflict: 'name' });

    if (tagInsertError) {
      return NextResponse.json({ error: 'Failed to upsert tags', details: tagInsertError }, { status: 500 });
    }

    // Step 3: Get tag IDs
    const { data: tagRecords, error: tagFetchError } = await supabaseAdmin
      .from('tags')
      .select('id')
      .in('name', tagNames);

    if (tagFetchError || !tagRecords) {
      return NextResponse.json({ error: 'Failed to fetch tag IDs' }, { status: 500 });
    }

    // Step 4: Link tags to task
    const tagLinks = tagRecords.map((tag) => ({
      task_id: task.id,
      tag_id: tag.id,
    }));

    const { error: linkError } = await supabaseAdmin
      .from('admin_task_tags')
      .insert(tagLinks);

    if (linkError) {
      return NextResponse.json({ error: 'Failed to link tags to task' }, { status: 500 });
    }

    return NextResponse.json(task);
}