import { Request, Response } from 'express';
import { projectService } from './project.service';
import { sendSuccess, sendPaginated } from '../../common/utils/response';

export class ProjectController {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await projectService.create(req.body, userId);
    sendSuccess(res, project, 201);
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const result = await projectService.findAll(req.query as any, userId, isAdmin);
    sendPaginated(res, result.data, result.page, result.limit, result.total);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await projectService.findById(req.params.id, userId, isAdmin);
    sendSuccess(res, project);
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await projectService.update(req.params.id, req.body, userId, isAdmin);
    sendSuccess(res, project);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await projectService.delete(req.params.id, userId, isAdmin);
    sendSuccess(res, { message: 'Project deleted successfully' });
  }
}

export const projectController = new ProjectController();
