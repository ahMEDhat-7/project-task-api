import { Request, Response } from 'express';
import { IProjectService } from './project.interface';
import { sendSuccess, sendPaginated } from '../../common/utils/response';
import { ProjectQueryParams } from './project.types';

export class ProjectController {
  constructor(private projectService: IProjectService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await this.projectService.create(req.body, userId);
    sendSuccess(res, project, 201);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const result = await this.projectService.findAll(req.query as ProjectQueryParams, userId, isAdmin);
    sendPaginated(res, result.data, result.page, result.limit, result.total);
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await this.projectService.findById(req.params.id, userId, isAdmin);
    sendSuccess(res, project);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const project = await this.projectService.update(req.params.id, req.body, userId, isAdmin);
    sendSuccess(res, project);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await this.projectService.delete(req.params.id, userId, isAdmin);
    sendSuccess(res, { message: 'Project deleted successfully' });
  };
}

import { projectService } from './project.service';
export const projectController = new ProjectController(projectService);
