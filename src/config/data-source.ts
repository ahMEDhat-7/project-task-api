import path from 'path';
import { DataSource } from 'typeorm';
import { env } from './env';

const isCompiled = __dirname.includes('dist');
const ext = isCompiled ? 'js' : 'ts';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV === 'development',
  migrationsRun: env.NODE_ENV !== 'development',
  logging: env.NODE_ENV === 'development',
  entities: [path.join(__dirname, `../modules/**/*.entity.${ext}`)],
  migrations: [path.join(__dirname, `../database/migrations/*.${ext}`)],
  subscribers: [],
});
