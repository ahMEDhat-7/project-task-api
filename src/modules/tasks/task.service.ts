import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Task } from './task.entity';
import { ITaskRepository } from './task.repository';
import { Project } from '../projects/project.entity';
import { IProjectRepository } from '../projects/project.repository';
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from './task.types';
import { ITaskService } from './task.interface';
import { NotFoundError } from '../../common/errors';
import { PaginatedResult } from '../../common/types';
import { getPagination } from '../../common/utils/pagination';
import { ensureProjectAccess } from '../projects/project.helpers';

export class TaskService implements ITaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private projectRepository: IProjectRepository,
  ) {}

  async create(input: CreateTaskInput, projectId: string, userId: string, isAdmin: boolean): Promise<Task> {
    await ensureProjectAccess(this.projectRepository, projectId, userId, isAdmin);

    const task = this.taskRepository.create({
      ...input,
      projectId,
    });

    return this.taskRepository.save(task);
  }

  async findByProject(
    projectId: string,
    query: TaskQueryParams,
    userId: string,
    isAdmin: boolean,
  ): Promise<PaginatedResult<Task>> {
    await ensureProjectAccess(this.projectRepository, projectId, userId, isAdmin);

    const { page, limit, skip, sortBy, order } = getPagination(query);

    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.where('task.projectId = :projectId', { projectId });

    this.applyTaskFilters(queryBuilder, query);

    queryBuilder.orderBy(`task.${sortBy}`, order);
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string, userId: string, isAdmin: boolean): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    await ensureProjectAccess(this.projectRepository, task.projectId, userId, isAdmin);

    return task;
  }

  async findAll(query: TaskQueryParams, userId: string, isAdmin: boolean): Promise<PaginatedResult<Task>> {
    const { page, limit, skip, sortBy, order } = getPagination(query);

    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.innerJoin('task.project', 'project');

    if (!isAdmin) {
      queryBuilder.where('project.ownerId = :userId', { userId });
    }

    this.applyTaskFilters(queryBuilder, query);

    queryBuilder.orderBy(`task.${sortBy}`, order);
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async update(id: string, input: UpdateTaskInput, userId: string, isAdmin: boolean): Promise<Task> {
    const task = await this.findById(id, userId, isAdmin);

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'] as const;
    for (const field of allowedFields) {
      if (field in input) {
        Object.assign(task, { [field]: input[field] });
      }
    }

    return this.taskRepository.save(task);
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const task = await this.findById(id, userId, isAdmin);
    await this.taskRepository.remove(task);
  }

  private applyTaskFilters(
    queryBuilder: SelectQueryBuilder<Task>,
    filters: TaskQueryParams,
  ): void {
    if (filters.status) {
      queryBuilder.andWhere('task.status = :status', { status: filters.status });
    }
    if (filters.priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority: filters.priority });
    }
    if (filters.dueDate) {
      const date = new Date(filters.dueDate);
      queryBuilder.andWhere('DATE(task.dueDate) = DATE(:dueDate)', { dueDate: date });
    }
  }
}

const taskRepository = AppDataSource.getRepository(Task);
const projectRepository = AppDataSource.getRepository(Project);
export const taskService = new TaskService(taskRepository, projectRepository);
