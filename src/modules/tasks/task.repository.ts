import { Task } from './task.entity';

export interface ITaskRepository {
  findOne(options: { where: any }): Promise<Task | null>;
  create(data: Partial<Task>): Task;
  save(task: Task): Promise<Task>;
  remove(task: Task): Promise<Task>;
  createQueryBuilder(alias: string): any;
}
