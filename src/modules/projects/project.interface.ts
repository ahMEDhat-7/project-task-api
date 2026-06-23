import { Project } from './project.entity';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryParams } from './project.types';
import { PaginatedResult } from '../../common/utils/pagination';

export interface IProjectService {
  create(input: CreateProjectInput, ownerId: string): Promise<Project>;
  findAll(query: ProjectQueryParams, userId: string, isAdmin: boolean): Promise<PaginatedResult<Project>>;
  findById(id: string, userId: string, isAdmin: boolean): Promise<Project>;
  update(id: string, input: UpdateProjectInput, userId: string, isAdmin: boolean): Promise<Project>;
  delete(id: string, userId: string, isAdmin: boolean): Promise<void>;
}
