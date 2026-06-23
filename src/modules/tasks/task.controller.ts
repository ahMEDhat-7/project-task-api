import { Request, Response } from 'express';
import { ITaskService } from './task.interface';
import { sendSuccess, sendPaginated } from '../../common/utils/response';
import { TaskQueryParams } from './task.types';
import { getUserContext } from '../../common/utils/auth';

export class TaskController {
  constructor(private taskService: ITaskService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { userId, isAdmin } = getUserContext(req);
    const { projectId } = req.params;
    const task = await this.taskService.create(req.body, projectId, userId, isAdmin);
    sendSuccess(res, task, 201);
  };

  findByProject = async (req: Request, res: Response): Promise<void> => {
    const { userId, isAdmin } = getUserContext(req);
    const { projectId } = req.params;
    const result = await this.taskService.findByProject(projectId, req.query as TaskQueryParams, userId, isAdmin);
    sendPaginated(res, result.data, result.page, result.limit, result.total);
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const { userId, isAdmin } = getUserContext(req);
    const task = await this.taskService.findById(req.params.id, userId, isAdmin);
    sendSuccess(res, task);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const { userId, isAdmin } = getUserContext(req);
    const result = await this.taskService.findAll(req.query as TaskQueryParams, userId, isAdmin);
    sendPaginated(res, result.data, result.page, result.limit, result.total);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { userId, isAdmin } = getUserContext(req);
    const task = await this.taskService.update(req.params.id, req.body, userId, isAdmin);
    sendSuccess(res, task);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { userId, isAdmin } = getUserContext(req);
    await this.taskService.delete(req.params.id, userId, isAdmin);
    sendSuccess(res, { message: 'Task deleted successfully' });
  };
}

import { taskService } from './task.service';
export const taskController = new TaskController(taskService);
