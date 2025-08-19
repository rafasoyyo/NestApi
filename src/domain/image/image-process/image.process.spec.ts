import * as fs from 'fs';
import * as path from 'path';
import { Types } from 'mongoose';

import { ProcessImageService } from '@domain/image/image-process/image.process';
import TaskRepository from '@domain/task/task.repository';
import { Task } from '@domain/task/task.entity';

class InMemoryRepo
  implements Omit<TaskRepository, 'model' | 'findOne' | 'update' | 'map'> {
  store = new Map<string, Task>();
  create(task: Omit<Task, 'taskId'>): Promise<Task> {
    const taskId = new Types.ObjectId();
    const created = new Task(
      taskId,
      task.status,
      task.price,
      task.originalPath,
    );
    this.store.set(taskId.toString(), created);
    return Promise.resolve(created);
  }
  findById(id: string): Promise<Task | null> {
    return Promise.resolve(this.store.get(id) || null);
  }
  update(task: Task): Promise<Task> {
    this.store.set(task.taskId.toString(), task);
    return Promise.resolve(task);
  }
}

describe('ProcessImageService', () => {
  const outputDir = process.env.OUTPUT_DIR!;
  const inputDir = process.env.INPUT_DIR!;
  const sampleImage = path.join(inputDir, 'sample.jpg');

  let repo: InMemoryRepo;
  let service: ProcessImageService;

  beforeAll(() => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    process.env.INPUT_DIR = inputDir;
    process.env.OUTPUT_DIR = outputDir;
  });

  beforeEach(() => {
    repo = new InMemoryRepo();
    service = new ProcessImageService(repo as any);
  });

  it('processes a local image and generates variants', async () => {
    const task = await repo.create(
      new Task(new Types.ObjectId(), 'pending', 10, sampleImage),
    );
    const result = await service.run(task);

    expect(result.status).toBe('completed');
    expect(result.images.length).toBe(2);
    result.images.forEach((img) => {
      const tmpDir = path.resolve(process.env.TEST_DIR!, `.${img.path}`);
      expect(fs.existsSync(tmpDir)).toBe(true);
    });
  });

  it('fails if source does not exist', async () => {
    const task = await repo.create(
      new Task(new Types.ObjectId(), 'pending', 10, './input/doesnotexist.jpg'),
    );
    await expect(service.run(task)).rejects.toThrow();
    const stored = await repo.findById(task.taskId.toString());
    expect(stored?.status).toBe('failed');
  });
});
