import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';

import { CreateTaskUseCase } from '@application/task-create/task.create';
import { GetTaskUseCase } from '@application/task-get/task.get';
import { ProcessImageService } from '@domain/image/image-process/image.process';

import { RepositoriesModule } from '@infra/db/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [TaskController],
  providers: [CreateTaskUseCase, GetTaskUseCase, ProcessImageService],
})
export class TaskHttpModule {}
