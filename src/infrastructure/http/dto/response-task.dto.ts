import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { type TaskStatus } from '@domain/task/task.entity';
import { Image } from '@domain/image/image.entity';

export class ResponseTaskDto {
  @ApiProperty({ description: 'Unique task ID' })
  taskId: Types.ObjectId;

  @ApiProperty({ example: 'pending', description: 'Task processing status' })
  status: TaskStatus;

  @ApiProperty({ example: 22.5, description: 'Price assigned to the task' })
  price: number;

  @ApiProperty({ description: 'List of processed images' })
  images: Image[] = [];
}
