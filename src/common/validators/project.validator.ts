import { z } from 'zod';
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../constants/validation';

const projectFields = {
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
};

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH),
  ...projectFields,
}).strict();

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH).optional(),
  ...projectFields,
}).strict();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
