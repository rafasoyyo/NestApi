import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import { createHash } from 'crypto';
import { extension } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

import { TasksMongoRepository } from '@infra/db/repositories/tasks.mongo.repository';
import { Task } from '@domain/task/task.entity';
import { Image } from '@domain/image/image.entity';

@Injectable()
export class ProcessImageService {
  private readonly outputDir = process.env.OUTPUT_DIR || './output';
  private readonly inputDir = process.env.INPUT_DIR || './input';

  constructor(private readonly tasksRepo: TasksMongoRepository) {}

  async run(task: Task): Promise<Task> {
    try {
      const localPath = await this.ensureLocal(task.originalPath);
      const originalName = path.parse(localPath).name;
      const ext = (path.parse(localPath).ext || '.jpg').replace('.', '');

      const variants = await this.generateVariants(
        localPath,
        originalName,
        ext,
      );
      task.images = variants;
      task.status = 'completed';
      task.updatedAt = new Date();

      const updated = await this.tasksRepo.update(task);
      return updated;
    } catch (err: any) {
      task.status = 'failed';
      // task.error = err?.message || 'processing error';
      task.updatedAt = new Date();
      await this.tasksRepo.update(task);
      throw err;
    }
  }

  private async ensureLocal(src: string): Promise<string> {
    if (/^https?:\/\//i.test(src)) {
      const res = await axios.get(src, { responseType: 'arraybuffer' });
      const contentType = res.headers['content-type'] || 'image/jpeg';
      const extFromMime = extension(contentType) || 'jpg';
      const file = path.resolve(
        this.inputDir,
        `tmp-${uuidv4()}.${extFromMime}`,
      );
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(res.data));
      return file;
    }
    const abs = path.resolve(src);
    if (!fs.existsSync(abs)) throw new Error('Source image not found');
    return abs;
  }

  private async generateVariants(
    localPath: string,
    originalName: string,
    ext: string,
  ): Promise<Image[]> {
    const targetWidths = [1024, 800];
    const out: Image[] = [];
    for (const width of targetWidths) {
      const buffer = await sharp(localPath)
        .resize({ width, withoutEnlargement: true })
        .toFormat(ext as any)
        .toBuffer();
      const md5 = createHash('md5').update(buffer).digest('hex');
      const dir = path.resolve(this.outputDir, originalName, String(width));
      const filePath = path.resolve(dir, `${md5}.${ext}`);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, buffer);
      out.push({
        resolution: width,
        path: filePath.replace(process.cwd(), ''),
        md5,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return out;
  }
}
