import { z } from 'zod';
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../constants/validation';

const taskFields = {
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional(),
};

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH),
  ...taskFields,
}).strict();

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH).optional(),
  ...taskFields,
}).strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
