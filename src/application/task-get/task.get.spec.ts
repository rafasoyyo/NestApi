import { Types } from 'mongoose';

import { GetTaskUseCase } from '@application/task-get/task.get';
import TasksRepository from '@domain/task/task.repository';
import { Task } from '@domain/task/task.entity';

class InMemoryRepo
  implements Omit<TasksRepository, 'model' | 'create' | 'update' | 'map'>
{
  store = new Map<string, Task>();
  findOne(taskId: Types.ObjectId): Promise<Task> {
    const created: Task = new Task(taskId, 'pending', 22.5, 'path');
    return Promise.resolve(created);
  }
}

describe('GetTaskUseCase', () => {
  it('Get a taks', async () => {
    const usecase = new GetTaskUseCase(new InMemoryRepo() as any);
    const task = await usecase.execute(new Types.ObjectId());
    expect(task.taskId).toBeDefined();
    expect(task.status).toBe('pending');
    expect(task.price).toBeGreaterThanOrEqual(0);
    expect(task.price).toBeLessThanOrEqual(50);
  });
});
