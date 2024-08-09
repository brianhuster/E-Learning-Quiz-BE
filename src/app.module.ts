import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizDurationModule } from './quiz-sheet/quiz-duration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { NotificationModule } from './notifications/notification.module';
import { UsersModule } from './users/users.module';
import { StudyPathModule } from './study-path/study-path.module';
import { MissionModule } from './missions/mission.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    QuizDurationModule,
    DatabaseModule,
    AuthModule,
    CourseModule,
    NotificationModule,
    UsersModule,
    StudyPathModule,
    MissionModule,
    SchedulerModule,
    QuestionsModule,
  ],
})
export class AppModule {}
