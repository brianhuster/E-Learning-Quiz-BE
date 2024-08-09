import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizQuestionEntity,
  QuizQuestionSchema,
} from './schema/quiz-questions/quiz-question.schema';
import {
  QuizAnswerSheetEntity,
  QuizAnswerSheetSchema,
} from './schema/quiz-answers/quiz-answers.schema';
import {
  MultipleChoiceQuizQuestionEntity,
  MultipleChoiceQuizQuestionSchema,
} from './schema/quiz-questions/multiple-choice.schema';
import { CourseEntity, CourseSchema } from './schema/courses/course.schema';
import {
  NotificationEntity,
  NotificationSchema,
} from './schema/notification/notifications.schema';
import { UserEntity, UserSchema } from './schema/users/user.schema';
import {
  StudyPathEntity,
  StudyPathSchema,
} from './schema/study-path/study-path.schema';
import {
  MissionEntity,
  MissionSchema,
} from './schema/missions/missions.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizAnswerSheetEntity.name,
        schema: QuizAnswerSheetSchema,
      },
      {
        name: QuizQuestionEntity.name,
        schema: QuizQuestionSchema,
        discriminators: [
          {
            name: MultipleChoiceQuizQuestionEntity.name,
            schema: MultipleChoiceQuizQuestionSchema,
          },
        ],
      },
      {
        name: CourseEntity.name,
        schema: CourseSchema,
      },
      {
        name: NotificationEntity.name,
        schema: NotificationSchema,
      },
      {
        name: UserEntity.name,
        schema: UserSchema,
      },
      {
        name: StudyPathEntity.name,
        schema: StudyPathSchema,
      },
      {
        name: MissionEntity.name,
        schema: MissionSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
