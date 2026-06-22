import { Request, Response } from 'express';
import { IProjectService } from './project.interface';
import { sendSuccess, sendPaginated } from '../../common/utils/response';

export class ProjectController {
  constructor(private projectService: IProjectService) {}

  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await this.projectService.create(req.body, userId);
    sendSuccess(res, project, 201);
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const result = await this.projectService.findAll(req.query as any, userId, isAdmin);
    sendPaginated(res, result.data, result.page, result.limit, result.total);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await this.projectService.findById(req.params.id, userId, isAdmin);
    sendSuccess(res, project);
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await this.projectService.update(req.params.id, req.body, userId, isAdmin);
    sendSuccess(res, project);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await this.projectService.delete(req.params.id, userId, isAdmin);
    sendSuccess(res, { message: 'Project deleted successfully' });
  }
}

import { projectService } from './project.service';
export const projectController = new ProjectController(projectService);
