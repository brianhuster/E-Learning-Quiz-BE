import { Module } from '@nestjs/common';
import { QuizDurationController } from './quiz-duration.controller';
import { QuizSheetService } from './quiz-sheet.service';
import { QuizSheetConfigService } from './quiz-sheet-config.service';
import { QuizSheetSubmitActionService } from './quiz-sheet-submit-action.service';
import { MissionModule } from 'src/missions/mission.module';
@Module({
  controllers: [QuizDurationController],
  imports: [MissionModule],
  providers: [
    QuizSheetService,
    QuizSheetConfigService,
    QuizSheetSubmitActionService,
  ],
  exports: [QuizSheetService],
})
export class QuizDurationModule {}
