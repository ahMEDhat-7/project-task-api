import { FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { Project } from './project.entity';

export interface IProjectRepository {
  findOne(options: { where: FindOptionsWhere<Project> }): Promise<Project | null>;
  create(data: Partial<Project>): Project;
  save(project: Project): Promise<Project>;
  softRemove(project: Project): Promise<Project>;
  createQueryBuilder(alias: string): SelectQueryBuilder<Project>;
}
