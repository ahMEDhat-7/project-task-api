import { UserRole } from './enums';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
