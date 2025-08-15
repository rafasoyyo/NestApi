import { Types } from 'mongoose';

import { CreateTaskUseCase } from '@application/task-create/task.create';
import TasksRepository from '@domain/task/task.repository';
import { Task } from '@domain/task/task.entity';

class InMemoryRepo
  implements Omit<TasksRepository, 'model' | 'findOne' | 'update' | 'map'>
{
  store = new Map<string, Task>();
  create(task: Omit<Task, 'taskId'>): Promise<Task> {
    const taskId = new Types.ObjectId();
    const created: Task = new Task(
      taskId,
      task.status,
      task.price,
      task.originalPath,
    );
    this.store.set(taskId.toString(), created);
    return Promise.resolve(created);
  }
}

describe('CreateTaskUseCase', () => {
  it('creates pending task with random price', async () => {
    const usecase = new CreateTaskUseCase(new InMemoryRepo() as any);
    const task = await usecase.execute('./input/sample.jpg');
    expect(task.taskId).toBeDefined();
    expect(task.status).toBe('pending');
    expect(task.price).toBeGreaterThanOrEqual(0);
    expect(task.price).toBeLessThanOrEqual(50);
  });
});
