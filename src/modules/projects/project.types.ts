import { ProjectStatus } from './project.entity';

export interface CreateProjectInput {
  title: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
}
