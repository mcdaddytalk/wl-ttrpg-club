import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

interface TaskPageProps {
  params: { id: string };
}

export default async function AdminTaskPage({ params }: TaskPageProps) {
  const { id } = params;

  const supabaseAdmin = await createSupabaseServerClient();

  const { data: task, error } = await supabaseAdmin
    .from('admin_tasks')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !task) notFound();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <Link href="/admin/tasks">
          <Button variant="outline" size="sm">← Back to Tasks</Button>
        </Link>
      </div>

      <div className="prose prose-sm text-muted-foreground">
        <Markdown remarkPlugins={[remarkGfm]}>
            {task.description || 'No description'}
        </Markdown>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Status:</strong> <span className="capitalize">{task.status.replace('_', ' ')}</span>
        </div>
        <div>
          <strong>Priority:</strong> <span className="capitalize">{task.priority}</span>
        </div>
        <div>
          <strong>Due Date:</strong> {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '—'}
        </div>
        <div>
          <strong>Assigned To:</strong> {task.assigned_to ?? '—'}
        </div>
        <div className="col-span-2">
          <strong>Tags:</strong> {task.tags?.join(', ') || '—'}
        </div>
      </div>
    </div>
  );
}
