import { Request, Response } from 'express';
import { IAuthService } from './auth.interface';
import { sendSuccess } from '../../common/utils/response';
import { getUserContext } from '../../common/utils/auth';

export class AuthController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const result = await this.authService.register({ name, email, password });
    sendSuccess(res, result, 201);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await this.authService.login({ email, password });
    sendSuccess(res, result);
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const { userId } = getUserContext(req);
    const user = await this.authService.getProfile(userId);
    sendSuccess(res, user);
  };
}

import { authService } from './auth.service';
export const authController = new AuthController(authService);
