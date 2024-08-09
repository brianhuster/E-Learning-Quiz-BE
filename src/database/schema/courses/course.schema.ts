import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

@Schema()
class CourseFigureEntity {
  @Prop({ required: true })
  figureName: string;

  @Prop({ required: true })
  figureNumber: number;
}

export const courseFigureSchema =
  SchemaFactory.createForClass(CourseFigureEntity);
export type CourseFigureDocument = HydratedDocument<CourseFigureEntity>;

@Schema()
export class CourseChapterEntity {
  @Prop({ required: true })
  chapterName: string;

  @Prop({ required: true })
  chapterNumber: number;

  @Prop({ required: true, type: [courseFigureSchema] })
  figures: CourseFigureEntity[];
}

//Define Course schema
@Schema({ collection: 'course_contents', timestamps: true })
export class CourseEntity {
  _id?: ObjectId;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true, type: [CourseChapterEntity] })
  chapters: CourseChapterEntity[];
}

export const CourseSchema = SchemaFactory.createForClass(CourseEntity);
export type CourseDocument = HydratedDocument<CourseEntity>;
