import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';
import pkg from '../../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project & Task Management API',
      version: pkg.version,
      description: 'A secure RESTful API for managing projects and tasks',
    },
    servers: [
      {
        url: `${env.APP_URL}:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
