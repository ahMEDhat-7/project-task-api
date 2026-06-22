import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../common/utils/response';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    sendSuccess(res, result, 201);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    sendSuccess(res, result);
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const user = await authService.getProfile(userId);
    sendSuccess(res, user);
  }
}

export const authController = new AuthController();
