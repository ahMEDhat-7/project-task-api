import { Router } from 'express';
import { projectController } from './project.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../../common/validators/project.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(createProjectSchema), (req, res, next) => projectController.create(req, res, next));
router.get('/', (req, res, next) => projectController.findAll(req, res, next));
router.get('/:id', (req, res, next) => projectController.findById(req, res, next));
router.put('/:id', validate(updateProjectSchema), (req, res, next) => projectController.update(req, res, next));
router.delete('/:id', (req, res, next) => projectController.delete(req, res, next));

export { router as projectRoutes };
