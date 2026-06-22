import { z } from 'zod';
import { MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH, PASSWORD_REGEX } from '../constants/validation';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(MAX_NAME_LENGTH),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .regex(PASSWORD_REGEX.uppercase, 'Must contain at least one uppercase letter')
    .regex(PASSWORD_REGEX.lowercase, 'Must contain at least one lowercase letter')
    .regex(PASSWORD_REGEX.digit, 'Must contain at least one digit')
    .regex(PASSWORD_REGEX.special, 'Must contain at least one special character'),
}).strict();

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
