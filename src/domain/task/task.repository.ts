import { Types } from 'mongoose';
import { Task } from './task.entity';

export default interface TaskRepository {
  create(task: Omit<Task, 'taskId'>): Promise<Task>;
  findOne(taskId: Types.ObjectId): Promise<Task | null>;
  update(task: Task): Promise<Task>;
}
