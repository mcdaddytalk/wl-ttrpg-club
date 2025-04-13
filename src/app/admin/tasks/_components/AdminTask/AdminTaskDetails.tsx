'use client';

import { useAdminTask, useDeleteAdminTask } from '@/hooks/admin/useAdminTasks';
import { useTaskUIStore } from '@/store/useTaskUIStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminTaskDetails() {
  const {
    selectedTaskId,
    isDetailsOpen,
    closeDetails,
    openForm,
  } = useTaskUIStore();

  const { data: task, isLoading } = useAdminTask(selectedTaskId ?? '');
  const deleteTask = useDeleteAdminTask(selectedTaskId ?? '');

  const handleDelete = async () => {
    if (!selectedTaskId) return;
    try {
      await deleteTask.mutateAsync();
      toast.success('Task deleted');
      closeDetails();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = () => {
    openForm(); // opens <AdminTaskForm /> in edit mode
    closeDetails(); // close this panel
  };

  return (
    <Dialog open={isDetailsOpen} onOpenChange={closeDetails}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>View and manage task details</DialogDescription>
        </DialogHeader>

        {isLoading || !task ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <div className={cn('prose prose-sm text-muted-foreground')}>
                <Markdown remarkPlugins={[remarkGfm]}>
                    {task.description || 'No description'}
                </Markdown>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Status:</strong> <span className="capitalize">{task.status.replace('_', ' ')}</span>
              </div>
              <div>
                <strong>Priority:</strong> <span className="capitalize">{task.priority}</span>
              </div>
              <div>
                <strong>Due Date:</strong>{' '}
                {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '—'}
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

            <div className="flex justify-between items-center pt-2">
              <Link href={`/admin/tasks/${task.id}`} className="text-sm text-muted-foreground underline">
                View full page
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteTask.isPending}>
                  Delete
                </Button>
                <Button variant="outline" size="sm" onClick={closeDetails}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}