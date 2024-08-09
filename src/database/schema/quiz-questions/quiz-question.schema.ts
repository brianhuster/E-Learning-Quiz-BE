import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { QUESTION_LEVEL, TypeQuizQuestion } from 'src/config/constants';

@Schema({
  discriminatorKey: 'type',
  timestamps: true,
  collection: 'quiz_questions',
})
export class QuizQuestionEntity {
  @Prop({
    required: true,
    enum: TypeQuizQuestion,
    index: true,
  })
  type: number;

  @Prop({
    default: '',
  })
  question: string;

  @Prop({
    required: true,
    default: 0,
  })
  chapter: number;

  @Prop({
    required: true,
    default: 0,
  })
  figure: number;

  @Prop({
    required: true,
    enum: QUESTION_LEVEL,
    default: QUESTION_LEVEL.UNDERSTAND,
  })
  level: number;

  @Prop()
  note: string;

  @Prop({
    required: true,
    default: 1,
  })
  point: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  config: {
    answers: unknown[];
  };
  createdAt: Date;
  updatedAt: Date;
  @Prop({})
  guideImg: string[];
  @Prop({})
  solveImg: string[];
  @Prop({})
  images: string[];
}

export const QuizQuestionSchema =
  SchemaFactory.createForClass(QuizQuestionEntity);
