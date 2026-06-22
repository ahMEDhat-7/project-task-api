import { AppDataSource } from '../../config/data-source';
import { Project } from './project.entity';
import { IProjectRepository } from './project.repository';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryParams } from './project.types';
import { IProjectService } from './project.interface';
import { NotFoundError, ForbiddenError } from '../../common/errors';
import { getPagination } from '../../common/utils/pagination';

export class ProjectService implements IProjectService {
  constructor(private projectRepository: IProjectRepository) {}

  async create(input: CreateProjectInput, ownerId: string): Promise<Project> {
    const project = this.projectRepository.create({
      ...input,
      ownerId,
    });

    return this.projectRepository.save(project);
  }

  async findAll(query: ProjectQueryParams, userId: string, isAdmin: boolean) {
    const { page, limit, skip, sortBy, order } = getPagination(query);

    const qb = this.projectRepository.createQueryBuilder('project');

    if (!isAdmin) {
      qb.where('project.ownerId = :userId', { userId });
    }

    if (query.search) {
      qb.andWhere('(project.title ILIKE :search OR project.description ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy(`project.${sortBy}`, order);
    qb.skip(skip);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string, userId: string, isAdmin: boolean): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (!isAdmin && project.ownerId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return project;
  }

  async update(id: string, input: UpdateProjectInput, userId: string, isAdmin: boolean): Promise<Project> {
    const project = await this.findById(id, userId, isAdmin);

    Object.assign(project, input);

    return this.projectRepository.save(project);
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const project = await this.findById(id, userId, isAdmin);

    await this.projectRepository.softRemove(project);
  }
}

const projectRepository = AppDataSource.getRepository(Project);
export const projectService = new ProjectService(projectRepository);
