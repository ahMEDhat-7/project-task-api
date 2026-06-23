import { AppDataSource } from '../../config/data-source';
import { Project } from './project.entity';
import { IProjectRepository } from './project.repository';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryParams } from './project.types';
import { IProjectService } from './project.interface';
import { getPagination, PaginatedResult } from '../../common/utils/pagination';
import { ensureProjectAccess } from './project.helpers';

export class ProjectService implements IProjectService {
  constructor(private projectRepository: IProjectRepository) {}

  async create(input: CreateProjectInput, ownerId: string): Promise<Project> {
    const project = this.projectRepository.create({
      ...input,
      ownerId,
    });

    return this.projectRepository.save(project);
  }

  async findAll(query: ProjectQueryParams, userId: string, isAdmin: boolean): Promise<PaginatedResult<Project>> {
    const { page, limit, skip, sortBy, order } = getPagination(query);

    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    if (!isAdmin) {
      queryBuilder.where('project.ownerId = :userId', { userId });
    }

    if (query.search) {
      queryBuilder.andWhere('(project.title ILIKE :search OR project.description ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    queryBuilder.orderBy(`project.${sortBy}`, order);
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string, userId: string, isAdmin: boolean): Promise<Project> {
    return ensureProjectAccess(this.projectRepository, id, userId, isAdmin);
  }

  async update(id: string, input: UpdateProjectInput, userId: string, isAdmin: boolean): Promise<Project> {
    const project = await this.findById(id, userId, isAdmin);

    const allowedFields = ['title', 'description', 'status'] as const;
    for (const field of allowedFields) {
      if (field in input) {
        Object.assign(project, { [field]: input[field] });
      }
    }

    return this.projectRepository.save(project);
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const project = await this.findById(id, userId, isAdmin);

    await this.projectRepository.softRemove(project);
  }
}

const projectRepository = AppDataSource.getRepository(Project);
export const projectService = new ProjectService(projectRepository);
