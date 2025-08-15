import { Injectable, NotFoundException } from '@nestjs/common';

// import type TaskRepository from '@domain/task/task.repository';
import { TasksMongoRepository } from '@infra/db/repositories/tasks.mongo.repository';
import { Task } from '@domain/task/task.entity';
import { Types } from 'mongoose';

@Injectable()
export class GetTaskUseCase {
  constructor(private readonly taskRepo: TasksMongoRepository) {}

  async execute(inputId: string): Promise<Task> {
    const taskId = new Types.ObjectId(inputId);
    const task: Task | null = await this.taskRepo.findOne(taskId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
