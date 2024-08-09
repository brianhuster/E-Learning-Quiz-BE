import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserDocument, UserEntity } from '../users/user.schema';
import { CourseDocument, CourseEntity } from '../courses/course.schema';

export type MissionDocument = HydratedDocument<MissionEntity>;

@Schema({
  collection: 'missions',
  timestamps: true,
})
export class MissionEntity {
  @Prop({ required: true, ref: UserEntity.name, type: SchemaTypes.ObjectId })
  user: UserDocument;
  @Prop({ required: true, ref: CourseEntity.name, type: SchemaTypes.ObjectId })
  course: CourseDocument;
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  title: string;

  @Prop()
  content?: string;

  @Prop({ default: false })
  isComplete: boolean;

  @Prop({ required: true })
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export const MissionSchema = SchemaFactory.createForClass(MissionEntity);

MissionSchema.index(
  { user: 1, id: 1, isComplete: 1 },
  { unique: true, partialFilterExpression: { isComplete: false } },
);
