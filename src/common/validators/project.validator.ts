import { z } from 'zod';
import { MAX_TITLE_LENGTH } from '../constants/validation';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH),
  description: z.string().max(1000).optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
}).strict();

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
}).strict();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
