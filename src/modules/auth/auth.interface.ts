import { RegisterInput, LoginInput, AuthResponse } from './auth.types';
import { User } from '../users/user.entity';

export interface IAuthService {
  register(input: RegisterInput): Promise<AuthResponse>;
  login(input: LoginInput): Promise<AuthResponse>;
  getProfile(userId: string): Promise<Omit<User, 'password'>>;
}
