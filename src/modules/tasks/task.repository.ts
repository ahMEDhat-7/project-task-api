import { FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { Task } from './task.entity';

export interface ITaskRepository {
  findOne(options: { where: FindOptionsWhere<Task> }): Promise<Task | null>;
  create(data: Partial<Task>): Task;
  save(task: Task): Promise<Task>;
  remove(task: Task): Promise<Task>;
  createQueryBuilder(alias: string): SelectQueryBuilder<Task>;
}
