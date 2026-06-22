import { Express } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { projectRoutes } from '../modules/projects/project.routes';
import { taskRoutes } from '../modules/tasks/task.routes';

export const registerRoutes = (app: Express): void => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/projects', projectRoutes);
  app.use('/api/v1', taskRoutes);
};
