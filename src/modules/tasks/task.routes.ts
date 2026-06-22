import { Router } from 'express';
import { taskController } from './task.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/tasks', (req, res, next) => taskController.findAll(req, res, next));
router.get('/tasks/:id', (req, res, next) => taskController.findById(req, res, next));
router.put('/tasks/:id', (req, res, next) => taskController.update(req, res, next));
router.delete('/tasks/:id', (req, res, next) => taskController.delete(req, res, next));

router.post('/projects/:projectId/tasks', (req, res, next) => taskController.create(req, res, next));
router.get('/projects/:projectId/tasks', (req, res, next) => taskController.findByProject(req, res, next));

export { router as taskRoutes };
