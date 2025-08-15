import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesRepository } from '@domain/image/image.repository';
import { Image } from '@domain/image/image.entity';

import { ImageModel } from '../mongoose/image.schema';

export class ImagesMongoRepository implements ImagesRepository {
  constructor(@InjectModel(ImageModel.name) private model: Model<ImageModel>) {}

  async insertMany(images: Image[], taskId: string): Promise<void> {
    if (!images.length) return;
    await this.model.insertMany(
      images.map((i) => ({
        path: i.path,
        md5: i.md5,
        resolution: i.resolution,
        taskId,
      })),
    );
  }
}
