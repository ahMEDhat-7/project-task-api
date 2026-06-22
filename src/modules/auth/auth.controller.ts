import { Request, Response } from 'express';
import { IAuthService } from './auth.interface';
import { sendSuccess } from '../../common/utils/response';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const result = await this.authService.register({ name, email, password });
    sendSuccess(res, result, 201);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this.authService.login({ email, password });
    sendSuccess(res, result);
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const user = await this.authService.getProfile(userId);
    sendSuccess(res, user);
  }
}

import { authService } from './auth.service';
export const authController = new AuthController(authService);
