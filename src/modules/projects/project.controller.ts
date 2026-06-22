import { Request, Response, NextFunction } from 'express';
import { projectService } from './project.service';
import { sendSuccess } from '../../common/utils/response';

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const project = await projectService.create(req.body, userId);
      sendSuccess(res, project, 201);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'admin';
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const result = await projectService.findAll(req.query as any, userId, isAdmin);
      const { sendPaginated } = await import('../../common/utils/response');
      sendPaginated(res, result.data, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'admin';
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const project = await projectService.findById(req.params.id, userId, isAdmin);
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'admin';
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const project = await projectService.update(req.params.id, req.body, userId, isAdmin);
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'admin';
      if (!userId) {
        throw new Error('User not authenticated');
      }
      await projectService.delete(req.params.id, userId, isAdmin);
      sendSuccess(res, { message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
