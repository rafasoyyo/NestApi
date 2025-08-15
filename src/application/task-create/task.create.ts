import { Injectable, BadRequestException } from '@nestjs/common';

import { Types } from 'mongoose';

import { TasksMongoRepository } from '@infra/db/repositories/tasks.mongo.repository';
import { Task } from '@domain/task/task.entity';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepo: TasksMongoRepository) {}

  async execute(source: string): Promise<Task> {
    if (!source) throw new BadRequestException('source is required');
    const price = Number((Math.random() * 50).toFixed(2));
    const task = new Task(
      new Types.ObjectId(Date.now()),
      'pending',
      price,
      source,
    );
    const created: Task = await this.taskRepo.create(task);
    return created;
  }
}
