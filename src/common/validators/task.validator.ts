import { z } from 'zod';
import { MAX_TITLE_LENGTH } from '../constants/validation';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH),
  description: z.string().max(1000).optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional(),
}).strict();

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional(),
}).strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
