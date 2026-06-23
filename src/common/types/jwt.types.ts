import { UserRole } from '../../modules/users/user.entity';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
