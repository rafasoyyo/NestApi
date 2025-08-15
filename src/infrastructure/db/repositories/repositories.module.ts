import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModel, TaskSchema } from '../mongoose/task.schema';
import { ImageModel, ImageSchema } from '../mongoose/image.schema';

// import { TaskRepository } from '@domain/task/task.repository';
// import { ImageRepository } from '@domain/image/image.repository';

import { TasksMongoRepository } from './tasks.mongo.repository';
import { ImagesMongoRepository } from './images.mongo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskModel.name, schema: TaskSchema },
      { name: ImageModel.name, schema: ImageSchema },
    ]),
  ],
  providers: [TasksMongoRepository, ImagesMongoRepository],
  exports: [TasksMongoRepository, ImagesMongoRepository],
})
export class RepositoriesModule {}
