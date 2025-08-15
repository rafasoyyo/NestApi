import { Image } from './image.entity';

export interface ImagesRepository {
  insertMany(images: Image[], taskId: string): Promise<void>;
}
