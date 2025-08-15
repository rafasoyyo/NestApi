import { Types } from 'mongoose';
import { Abstract } from '../abstract/abstract.entity';
import { Image } from '../image/image.entity';

export type TaskStatus = 'pending' | 'completed' | 'failed';

export class Task extends Abstract {
  constructor(
    public taskId: Types.ObjectId,
    public status: TaskStatus,
    public price: number,
    public readonly originalPath: string,
    public images: Image[] = [],
  ) {
    super();
  }
}
