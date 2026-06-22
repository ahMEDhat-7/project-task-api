import { AppDataSource } from '../../config/data-source';
import { Task } from './task.entity';
import { ITaskRepository } from './task.repository';
import { Project } from '../projects/project.entity';
import { IProjectRepository } from '../projects/project.repository';
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from './task.types';
import { ITaskService } from './task.interface';
import { NotFoundError, ForbiddenError } from '../../common/errors';
import { getPagination } from '../../common/utils/pagination';

export class TaskService implements ITaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private projectRepository: IProjectRepository,
  ) {}

  async create(input: CreateTaskInput, projectId: string, userId: string, isAdmin: boolean): Promise<Task> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (!isAdmin && project.ownerId !== userId) {
      throw new ForbiddenError('Access denied');
    }

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
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (!isAdmin && project.ownerId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    const { page, limit, skip, sortBy, order } = getPagination(query);

    const qb = this.taskRepository.createQueryBuilder('task');
    qb.where('task.projectId = :projectId', { projectId });

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }

    if (query.dueDate) {
      const date = new Date(query.dueDate);
      qb.andWhere('DATE(task.dueDate) = DATE(:dueDate)', { dueDate: date });
    }

    qb.orderBy(`task.${sortBy}`, order);
    qb.skip(skip);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string, userId: string, isAdmin: boolean): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const project = await this.projectRepository.findOne({
      where: { id: task.projectId },
    });

    if (project && !isAdmin && project.ownerId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return task;
  }

  async findAll(query: TaskQueryParams, userId: string, isAdmin: boolean) {
    const { page, limit, skip, sortBy, order } = getPagination(query);

    const qb = this.taskRepository.createQueryBuilder('task');
    qb.innerJoin('task.project', 'project');

    if (!isAdmin) {
      qb.where('project.ownerId = :userId', { userId });
    }

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }

    if (query.dueDate) {
      const date = new Date(query.dueDate);
      qb.andWhere('DATE(task.dueDate) = DATE(:dueDate)', { dueDate: date });
    }

    qb.orderBy(`task.${sortBy}`, order);
    qb.skip(skip);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async update(id: string, input: UpdateTaskInput, userId: string, isAdmin: boolean): Promise<Task> {
    const task = await this.findById(id, userId, isAdmin);

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'] as const;
    for (const field of allowedFields) {
      if (field in input) {
        (task as unknown as Record<string, unknown>)[field] = (input as Record<string, unknown>)[field];
      }
    }

    return this.taskRepository.save(task);
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const task = await this.findById(id, userId, isAdmin);
    await this.taskRepository.remove(task);
  }
}

const taskRepository = AppDataSource.getRepository(Task);
const projectRepository = AppDataSource.getRepository(Project);
export const taskService = new TaskService(taskRepository, projectRepository);
