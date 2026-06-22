import { FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';

export interface IUserRepository {
  findOne(options: FindOneOptions<User>): Promise<User | null>;
  create(data: Partial<User>): User;
  save(user: User): Promise<User>;
  createQueryBuilder(alias: string): SelectQueryBuilder<User>;
}
