import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'tasks' })
export class TaskModel {
  @Prop({
    unique: true,
    required: true,
    default: new Types.ObjectId(),
  })
  taskId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['pending', 'completed', 'failed'],
    index: true,
  })
  status!: 'pending' | 'completed' | 'failed';

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true })
  originalPath!: string;

  @Prop({
    type: [{ resolution: Number, path: String, md5: String, createdAt: Date }],
    default: [],
  })
  images!: { resolution: number; path: string; md5: string; createdAt: Date }[];
}
export const TaskSchema = SchemaFactory.createForClass(TaskModel);
TaskSchema.index({ 'images.md5': 1 });
