import { Request, Response } from 'express';
import { ITaskService } from './task.interface';
import { sendSuccess, sendPaginated } from '../../common/utils/response';
import { TaskQueryParams } from './task.types';
import { UserRole } from '../users/user.entity';

export class TaskController {
  constructor(private taskService: ITaskService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === UserRole.ADMIN;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const { projectId } = req.params;
    const task = await this.taskService.create(req.body, projectId, userId, isAdmin);
    sendSuccess(res, task, 201);
  };

  findByProject = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === UserRole.ADMIN;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const { projectId } = req.params;
    const result = await this.taskService.findByProject(projectId, req.query as TaskQueryParams, userId, isAdmin);
    sendPaginated(res, result.data, result.page, result.limit, result.total);
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const task = await this.taskService.findById(req.params.id);
    sendSuccess(res, task);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const isAdmin = req.user?.role === UserRole.ADMIN;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const result = await this.taskService.findAll(req.query as TaskQueryParams, userId, isAdmin);
    sendPaginated(res, result.data, result.page, result.limit, result.total);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const task = await this.taskService.update(req.params.id, req.body);
    sendSuccess(res, task);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.taskService.delete(req.params.id);
    sendSuccess(res, { message: 'Task deleted successfully' });
  };
}

import { taskService } from './task.service';
export const taskController = new TaskController(taskService);
