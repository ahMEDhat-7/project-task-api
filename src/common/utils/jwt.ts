import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { JwtPayload } from '../../modules/auth/auth.types';

export class JwtUtil {
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }
}

export const jwtUtil = new JwtUtil();
