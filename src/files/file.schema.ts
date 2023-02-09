import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class File {
  fileid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  storedName: string;

  @Prop({ required: true })
  size: number;

  @Prop({ default: new Date() })
  created_at: Date;
}

const FileSchema = SchemaFactory.createForClass(File);
FileSchema.virtual('fileid').get(function (this: FileDocument) {
  return this.id;
});

export { FileSchema };
