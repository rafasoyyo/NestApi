import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, ObjectId, Types } from 'mongoose';

import TaskRepository from '@domain/task/task.repository';
import { Task } from '@domain/task/task.entity';
import { TaskModel } from '../mongoose/task.schema';
import { Image } from '@domain/image/image.entity';

export type TaskDocument = Task & Document<ObjectId>;

export class TasksMongoRepository implements TaskRepository {
  constructor(@InjectModel(TaskModel.name) private model: Model<TaskModel>) {}

  async create(task: Task): Promise<Task> {
    const created = (await this.model.create({
      taskId: task.taskId,
      status: task.status,
      price: task.price,
      originalPath: task.originalPath,
      images: [],
    })) as unknown as TaskDocument;
    return this.map(created);
  }

  async findOne(taskId: Types.ObjectId): Promise<Task | null> {
    const doc: TaskDocument | null = await this.model.findOne({ taskId });
    return doc ? this.map(doc) : null;
  }

  async update(task: Task): Promise<Task> {
    const doc: TaskDocument | null = await this.model.findOneAndUpdate(
      { taskId: task.taskId },
      {
        status: task.status,
        price: task.price,
        originalPath: task.originalPath,
        images: task.images,
      },
      { new: true },
    );
    if (!doc) throw new Error('Task not found for update');
    return this.map(doc);
  }

  private map(doc: TaskDocument): Task {
    return new Task(
      doc.taskId,
      doc.status,
      doc.price,
      doc.originalPath,
      (doc.images || []).map((i: Image) => ({
        resolution: i.resolution,
        path: i.path,
        md5: i.md5,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
    );
  }
}
