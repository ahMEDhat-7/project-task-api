import { FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';

export interface IUserRepository {
  findOne(options: { where: FindOptionsWhere<User>; select?: string[] }): Promise<User | null>;
  create(data: Partial<User>): User;
  save(user: User): Promise<User>;
  createQueryBuilder(alias: string): SelectQueryBuilder<User>;
}
