import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { swaggerSpec } from './docs/swagger';
import { registerRoutes } from './routes';

const app = express();

app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(env.DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

registerRoutes(app);

app.get(env.HEALTH_PATH, (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export { app };
