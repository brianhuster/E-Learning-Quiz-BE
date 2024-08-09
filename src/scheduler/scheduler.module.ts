import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { RememberService } from './remember.service';
import { QuizDurationModule } from 'src/quiz-sheet/quiz-duration.module';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  controllers: [SchedulerController],
  providers: [RememberService],
  imports: [QuizDurationModule, NotificationModule],
})
export class SchedulerModule {}
