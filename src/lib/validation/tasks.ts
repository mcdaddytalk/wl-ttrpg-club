import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../types/custom';

export const TaskStatusEnum = z.enum(TASK_STATUSES);
export const TaskPriorityEnum = z.enum(TASK_PRIORITIES);

export const TaskCreateSchema = z.object({
    title: z.string().min(1),
    status: TaskStatusEnum.default('pending'),
    priority: TaskPriorityEnum.default('medium'),
    created_by: z.string().uuid().optional().nullable(),
    assigned_to: z.string().uuid().nullable().optional().transform(val => val ?? null),
    description: z.string().nullable().optional().transform(val => val ?? null),
    due_date: z.string().nullable().optional().transform(val => val ?? null),
    tags: z.array(z.string()).nullable().optional().transform(val => val ?? null),
});

export const TaskUpdateSchema = TaskCreateSchema.partial()

export const TaskFilterSchema = z.object({
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  search: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  due_before: z.string().optional(), // ISO date string
  include_archived: z.boolean().optional(),
  tags: z
    .union([
      z.string().transform((s) => s.split(',').filter(Boolean)), // "a,b,c"
      z.array(z.string()), // ["a", "b"]
    ])
    .optional(),
});

export type TaskFilter = z.infer<typeof TaskFilterSchema>;