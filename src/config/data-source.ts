import path from 'path';
import { DataSource } from 'typeorm';
import { env } from './env';

const isCompiled = __dirname.includes('dist');
const sourceDir = isCompiled ? '../..' : 'src';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  entities: [path.join(__dirname, sourceDir, 'modules/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, sourceDir, 'database/migrations/*.{ts,js}')],
  subscribers: [],
});
