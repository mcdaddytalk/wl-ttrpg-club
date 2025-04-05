'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskCreateSchema } from '@/lib/validation/tasks';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTaskUIStore } from '@/store/useTaskUIStore';
import { useAdminTask, useCreateAdminTask, useUpdateAdminTask } from '@/hooks/admin/useAdminTasks';
import { useAdminMembers } from '@/hooks/admin/useAdminMembers';
import { useEffect } from 'react';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/types/custom';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
import { toSentenceCase } from '@/lib/utils';
import logger from '@/utils/logger';
import { TagAutoSuggest } from '@/components/TagAutoSuggest';

const emptyValues: z.infer<typeof TaskCreateSchema> = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assigned_to: null,
    due_date: null,
    tags: [],
  };
  
  export default function AdminTaskForm() {
    const { isFormOpen, closeForm, selectedTaskId } = useTaskUIStore();
    const { data: members } = useAdminMembers();
  
    const isEditing = Boolean(selectedTaskId);
  
    const createTask = useCreateAdminTask();
    const { data: taskData } = useAdminTask(selectedTaskId ?? '');
    const updateTask = useUpdateAdminTask(selectedTaskId ?? '');
  
    const form = useForm<z.infer<typeof TaskCreateSchema>>({
      resolver: zodResolver(TaskCreateSchema),
      defaultValues: emptyValues,
    });
  
    // Populate form for editing
    useEffect(() => {
      if (isEditing && taskData) {
        form.reset({
          title: taskData.title,
          description: taskData.description ?? '',
          priority: taskData.priority,
          status: taskData.status,
          assigned_to: taskData.assigned_to.id,
          due_date: taskData.due_date ?? null,
          tags: taskData.tags.map((t) => t.name) ?? [],
        });
      } else {
        form.reset(emptyValues);
      }
    }, [isEditing, taskData, form]);
  
    const onSubmit = async (values: z.infer<typeof TaskCreateSchema>) => {
      const payload = {
        ...values,
        assigned_to: values.assigned_to === 'unassigned' ? null : values.assigned_to,
        due_date: values.due_date || null,
      };
  
      try {
        if (isEditing) {
          await updateTask.mutateAsync(payload);
          toast.success('Task updated');
        } else {
          logger.debug('Creating task', payload);
          await createTask.mutateAsync(payload);
          toast.success('Task created');
        }
        form.reset(emptyValues);
        closeForm();
      } catch {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} task`);
      }
    };
  
    return (
      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'Create Task'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edit task details' : 'Create a new task'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register('title')} placeholder="Task title" />
            <Textarea
              {...form.register('description')}
              placeholder="Task description (markdown supported)"
            />
  
            <div className="grid grid-cols-2 gap-2">
              <Controller
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    defaultValue={field.value ?? undefined}                    
                  >
                    <SelectTrigger className="w-full border p-2 rounded">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {toSentenceCase(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    defaultValue={field.value ?? undefined}
                  >
                    <SelectTrigger className="w-full border p-2 rounded">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {toSentenceCase(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
  
            <div className="grid grid-cols-2 gap-2">
              <Controller
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(val === 'unassigned' ? null : val)}
                    value={field.value ?? 'unassigned'}
                    defaultValue={field.value ?? 'unassigned'}
                  >
                    <SelectTrigger className="w-full border p-2 rounded">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {members?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                {...form.register('due_date')}
                type="date"
                placeholder="Due date"
                className="text-right"
              />
            </div>
            <Controller
              control={form.control}
              name="tags"
              render={({ field }) => (
                <TagAutoSuggest value={field.value ?? []} onChange={field.onChange} />
              )}
            />
  
            <Button
              type="submit"
              className="w-full"
              disabled={createTask.isPending || updateTask.isPending}
            >
              {isEditing
                ? updateTask.isPending
                  ? 'Updating...'
                  : 'Update Task'
                : createTask.isPending
                ? 'Creating...'
                : 'Create Task'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }