import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { useAdminTask } from '@/hooks/admin/useAdminTasks';

interface TaskDetailsPageProps {
  id: string;
}

export const TaskDetailsPage = ({ id}: TaskDetailsPageProps): React.ReactElement => {
  const { data: task, error } = useAdminTask(id);

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
          <strong>Assigned To:</strong>
            {
              task.assigned_to 
                ? task.assigned_to.displayName 
                : 'Unassigned'
            }
        </div>
        <div className="col-span-2">
          <strong>Tags:</strong> {task.tags?.join(', ') || '—'}
        </div>
      </div>
    </div>
  );
}
