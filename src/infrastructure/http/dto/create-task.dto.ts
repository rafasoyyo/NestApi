import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Local path or URL of the original image' })
  @IsString()
  @MinLength(3)
  source!: string;
}
