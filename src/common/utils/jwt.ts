import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { JwtPayload } from '../../modules/auth/auth.types';

type JwtTimeString = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'M' | 'Y'}`;

export class JwtUtil {
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as JwtTimeString,
      algorithm: 'HS256',
    });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
  }
}

export const jwtUtil = new JwtUtil();
