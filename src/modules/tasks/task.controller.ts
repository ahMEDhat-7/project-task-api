import { Request, Response, NextFunction } from 'express';
import { taskService } from './task.service';
import { sendSuccess } from '../../common/utils/response';
import { sendPaginated } from '../../common/utils/response';

export class TaskController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'admin';
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { projectId } = req.params;
      const task = await taskService.create(req.body, projectId, userId, isAdmin);
      sendSuccess(res, task, 201);
    } catch (error) {
      next(error);
    }
  }

  async findByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'admin';
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { projectId } = req.params;
      const result = await taskService.findByProject(projectId, req.query as any, userId, isAdmin);
      sendPaginated(res, result.data, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.findById(req.params.id);
      sendSuccess(res, task);
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
      const result = await taskService.findAll(req.query as any, userId, isAdmin);
      sendPaginated(res, result.data, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.update(req.params.id, req.body);
      sendSuccess(res, task);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await taskService.delete(req.params.id);
      sendSuccess(res, { message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
