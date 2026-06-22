import { Project } from './project.entity';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryParams } from './project.types';

export interface IProjectService {
  create(input: CreateProjectInput, ownerId: string): Promise<Project>;
  findAll(query: ProjectQueryParams, userId: string, isAdmin: boolean): Promise<{
    data: Project[];
    total: number;
    page: number;
    limit: number;
  }>;
  findById(id: string, userId: string, isAdmin: boolean): Promise<Project>;
  update(id: string, input: UpdateProjectInput, userId: string, isAdmin: boolean): Promise<Project>;
  delete(id: string, userId: string, isAdmin: boolean): Promise<void>;
}
