import { Abstract } from '../abstract/abstract.entity';

export interface Image extends Abstract {
  resolution: number;
  path: string;
  md5: string;
}
