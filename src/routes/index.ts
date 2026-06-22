import { Express } from 'express';
import { env } from '../config/env';
import { authRoutes } from '../modules/auth/auth.routes';
import { projectRoutes } from '../modules/projects/project.routes';
import { taskRoutes } from '../modules/tasks/task.routes';

export const registerRoutes = (app: Express): void => {
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/projects`, projectRoutes);
  app.use(env.API_PREFIX, taskRoutes);
};
