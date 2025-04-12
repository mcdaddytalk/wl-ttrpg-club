'use client';

import { TaskDO } from '@/lib/types/custom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { format } from 'date-fns';
import { useTaskUIStore } from '@/store/useTaskUIStore';
import { useAdminTasks } from '@/hooks/admin/useAdminTasks';
import { AdminTaskStatusBadge } from './AdminTaskStatusBadge';
import { AdminTaskPriorityBadge } from './AdminTaskPriorityBadge';

export default function AdminTaskList() {
  const { data: tasks, isLoading } = useAdminTasks();
  const { setSelectedTaskId, openDetails } = useTaskUIStore();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.map((task: TaskDO) => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => {
                setSelectedTaskId(task.id);
                openDetails();
              }}
            >
              <TableCell>{task.title}</TableCell>
              <TableCell><AdminTaskStatusBadge status={task.status} /></TableCell>
              <TableCell><AdminTaskPriorityBadge priority={task.priority} /></TableCell>
              <TableCell>{task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '—'}</TableCell>
              <TableCell>
                {
                  task.assigned_to 
                    ? task.assigned_to.displayName 
                    : 'Unassigned'
                }
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTaskId(task.id);
                    openDetails();
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
