import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'images',
})
export class ImageModel {
  @Prop({ required: true })
  path!: string;

  @Prop({ required: true, index: true })
  md5!: string;

  @Prop({ required: true })
  resolution!: number;

  @Prop({ required: true })
  taskId!: string;
}
export const ImageSchema = SchemaFactory.createForClass(ImageModel);
ImageSchema.index({ taskId: 1, resolution: 1 });
