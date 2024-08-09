import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, HydratedDocument } from 'mongoose';
import { QuizQuestionEntity } from '../quiz-questions/quiz-question.schema';
import { UserEntity } from '../users/user.schema';
import { StudyPathEntity } from '../study-path/study-path.schema';

@Schema()
export class AnswerHistoryEntity {
  @Prop({
    required: true,
  })
  answers: unknown[];

  @Prop({
    required: true,
  })
  duration: number;
  @Prop({
    required: true,
  })
  correct: boolean;
}

const AnswerHistorySchema = SchemaFactory.createForClass(AnswerHistoryEntity);

@Schema()
export class LeanerQuestionEntity {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: QuizQuestionEntity.name,
    required: true,
  })
  question: QuizQuestionEntity;

  @Prop({
    type: [AnswerHistorySchema],
  })
  histories: AnswerHistoryEntity[];

  @Prop({
    required: true,
    default: false,
  })
  correct: boolean;

  @Prop()
  isRandom: boolean;

  @Prop()
  isWeak: boolean;
}

const LeanerQuestionSchema = SchemaFactory.createForClass(LeanerQuestionEntity);

@Schema({ collection: 'quiz_answer_sheet', timestamps: true })
export class QuizAnswerSheetEntity {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: UserEntity.name,
  })
  user?: UserEntity;
  @Prop({})
  chapter?: number;
  @Prop({})
  figure?: number;
  @Prop({})
  level?: number;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: StudyPathEntity.name,
  })
  studyPath?: StudyPathEntity;
  @Prop({
    required: true,
  })
  configType: number;
  // @Prop({
  //   required: true,
  // })
  // courseId: string;
  @Prop({
    required: true,
  })
  quizDuration: number;
  @Prop({
    type: [LeanerQuestionSchema],
  })
  questions: LeanerQuestionEntity[];
  @Prop()
  submittedAt: Date;
  @Prop()
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

export const QuizAnswerSheetSchema = SchemaFactory.createForClass(
  QuizAnswerSheetEntity,
);
export type QuizAnswerSheetDocument = HydratedDocument<QuizAnswerSheetEntity>;
