import { Task } from './task.entity';
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from './task.types';

export interface ITaskService {
  create(input: CreateTaskInput, projectId: string, userId: string, isAdmin: boolean): Promise<Task>;
  findByProject(projectId: string, query: TaskQueryParams, userId: string, isAdmin: boolean): Promise<{
    data: Task[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string): Promise<Task>;
  findAll(query: TaskQueryParams, userId: string, isAdmin: boolean): Promise<{
    data: Task[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
}
