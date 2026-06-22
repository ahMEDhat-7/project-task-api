import { User } from './user.entity';

export interface IUserRepository {
  findOne(options: { where: any; select?: string[] }): Promise<User | null>;
  create(data: Partial<User>): User;
  save(user: User): Promise<User>;
  createQueryBuilder(alias: string): any;
}
