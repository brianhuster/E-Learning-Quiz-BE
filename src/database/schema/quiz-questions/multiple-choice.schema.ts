import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { QuizQuestionEntity } from './quiz-question.schema';

@Schema()
export class MultipleChoiceConfigEntity {
  @Prop({
    required: true,
    default: [],
  })
  answers: number[];

  @Prop({
    required: true,
    minlength: 2,
  })
  options: string[];

  @Prop({
    required: true,
    default: 1,
  })
  @Prop({
    required: true,
    default: false,
  })
  componentScore: boolean;
}
export const MultipleChoiceConfigSchema = SchemaFactory.createForClass(
  MultipleChoiceConfigEntity,
);

@Schema()
export class MultipleChoiceQuizQuestionEntity implements QuizQuestionEntity {
  type: number;
  question: string;
  note: string;
  point: number;
  chapter: number;
  figure: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  guideImg: string[];
  solveImg: string[];
  images: string[];
  @Prop({
    type: MultipleChoiceConfigSchema,
    required: true,
  })
  declare config: MultipleChoiceConfigEntity;
}

export const MultipleChoiceQuizQuestionSchema = SchemaFactory.createForClass(
  MultipleChoiceQuizQuestionEntity,
);
