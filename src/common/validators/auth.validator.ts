import { z } from 'zod';
import { MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH } from '../constants/validation';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(MAX_NAME_LENGTH),
  email: z.string().email('Invalid email format'),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
