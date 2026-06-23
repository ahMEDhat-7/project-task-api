import { IProjectRepository } from './project.repository';
import { Project } from './project.entity';
import { NotFoundError, ForbiddenError } from '../../common/errors';

export const ensureProjectAccess = async (
  repo: IProjectRepository,
  projectId: string,
  userId: string,
  isAdmin: boolean,
): Promise<Project> => {
  const project = await repo.findOne({ where: { id: projectId } });
  if (!project) throw new NotFoundError('Project not found');
  if (!isAdmin && project.ownerId !== userId) throw new ForbiddenError('Access denied');
  return project;
};
