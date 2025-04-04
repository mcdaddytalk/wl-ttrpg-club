import { useQuery, useMutation } from '@tanstack/react-query';
import { TaskDO } from '@/lib/types/custom';
import { TaskCreateSchema, TaskUpdateSchema } from '@/lib/validation/tasks';
import { z } from 'zod';
import { useQueryClient } from '../useQueryClient';
import { useTaskFilters } from '../useTaskFilters';

export const useAdminTasks = () => {
    const { filters } = useTaskFilters();

    return useQuery({
    queryKey: ['admin-tasks', filters],
    queryFn: async (): Promise<TaskDO[]> => {
      const query = new URLSearchParams();

      if (filters.status) query.set('status', filters.status);
      if (filters.priority) query.set('priority', filters.priority);
      if (filters.assigned_to) query.set('assigned_to', filters.assigned_to);
      if (filters.due_before) query.set('due_before', filters.due_before);
      if (filters.include_archived) query.set('include_archived', filters.include_archived.valueOf().toString());
      if (filters.tags?.length) query.set('tags', filters.tags.join(','));

      const res = await fetch(`/api/admin/tasks?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });
}

export const useAdminTask = (id: string) => 
  useQuery({
    queryKey: ['admin-task', id],
    queryFn: async (): Promise<TaskDO> => {
      const res = await fetch(`/api/admin/tasks/${id}`);
      if (!res.ok) throw new Error('Failed to fetch task');
      return res.json();
    },
    enabled: !!id,
  });

export const useCreateAdminTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: z.infer<typeof TaskCreateSchema>) => {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tasks'] }),
  });
};

export const useUpdateAdminTask = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: z.infer<typeof TaskUpdateSchema>) => {
      const res = await fetch(`/api/admin/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tasks'] }),
  });
};

export const useDeleteAdminTask = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tasks'] }),
  });
};
