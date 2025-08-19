import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, OmitType } from '@nestjs/swagger';

import { CreateTaskDto } from '../dto/create-task.dto';
import { CreateTaskUseCase } from '@application/task-create/task.create';
import { GetTaskUseCase } from '@application/task-get/task.get';
import { ProcessImageService } from '@domain/image/image-process/image.process';
import { Task } from '@domain/task/task.entity';
import { ResponseTaskDto } from '../dto/response-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor (
    private readonly createTask: CreateTaskUseCase,
    private readonly getTask: GetTaskUseCase,
    private readonly processor: ProcessImageService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a processing tasks' })
  @ApiResponse({
    status: 201,
    description: 'New task created',
    type: class CreateTaskResponse extends OmitType(ResponseTaskDto, ['images']) {},
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  async create(@Body() dto: CreateTaskDto) {
    const task: Task = await this.createTask.execute(dto.source);
    // On a prod environment this should be push to a queue of tasks
    setTimeout(() => {
      this.processor.run(task).catch(console.error);
    }, 10000);
    return {
      taskId: task.taskId,
      status: 'pending',
      price: task.price,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task Info' })
  @ApiResponse({
    status: 201,
    description: 'Get task Info',
    type: class GetTaskResponse extends ResponseTaskDto {},
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async get(@Param('id') id: string) {
    const task = await this.getTask.execute(id);
    return {
      taskId: task.taskId,
      status: task.status,
      price: task.price,
      images:
        task.status === 'completed'
          ? task.images
            .sort((a, b) => b.resolution - a.resolution)
            .map((i) => ({ resolution: String(i.resolution), path: i.path }))
          : undefined,
    };
  }
}
