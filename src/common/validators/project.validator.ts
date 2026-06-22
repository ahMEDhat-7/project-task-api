import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
