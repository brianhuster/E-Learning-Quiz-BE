import { Module } from '@nestjs/common';
import { StudyPathService } from './study-path.service';
import { StudyPathController } from './study-path.controller';
import { QuizDurationModule } from 'src/quiz-sheet/quiz-duration.module';

@Module({
  controllers: [StudyPathController],
  providers: [StudyPathService],
  imports: [QuizDurationModule],
})
export class StudyPathModule {}
