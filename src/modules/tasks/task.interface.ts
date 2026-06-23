import { Task } from './task.entity';
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from './task.types';
import { PaginatedResult } from '../../common/types';

export interface ITaskService {
  create(input: CreateTaskInput, projectId: string, userId: string, isAdmin: boolean): Promise<Task>;
  findByProject(projectId: string, query: TaskQueryParams, userId: string, isAdmin: boolean): Promise<PaginatedResult<Task>>;
  findById(id: string, userId: string, isAdmin: boolean): Promise<Task>;
  findAll(query: TaskQueryParams, userId: string, isAdmin: boolean): Promise<PaginatedResult<Task>>;
  update(id: string, input: UpdateTaskInput, userId: string, isAdmin: boolean): Promise<Task>;
  delete(id: string, userId: string, isAdmin: boolean): Promise<void>;
}
