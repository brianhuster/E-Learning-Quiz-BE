import dayjs, { Dayjs } from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EF_VALUES, TIME_UNIT } from 'src/config/constants';
import { StudyPathEntity } from 'src/database/schema/study-path/study-path.schema';
import { slitIdToNumbers } from 'src/utils';
import { QuizSheetService } from 'src/quiz-sheet/quiz-sheet.service';
import { NotificationService } from 'src/notifications/notification.service';

@Injectable()
export class RememberService {
  constructor(
    @InjectModel(StudyPathEntity.name)
    private studyPathModel: Model<StudyPathEntity>,
    private quizSheetService: QuizSheetService,
    private notificationService: NotificationService,
  ) {}
  async remindQuestion() {
    const yesterday = dayjs().subtract(1, 'day');

    await this.studyPathModel
      .find({
        timeScheduler: { $lte: yesterday.toDate() },
      })
      .sort({ timeScheduler: 1, createdAt: 1 })
      .cursor({ batchSize: 100 })
      .eachAsync(async (doc) => {
        const { content, unlockIndex = 0, user } = doc;
        const learnedPath = content
          .slice(0, unlockIndex)
          .filter(({ element, cntRepeat, lastStudy }, index) => {
            const dayMustRepeat = this.getDayMustRepeat(
              element,
              cntRepeat || 1,
            );
            const valid =
              dayjs().diff(dayjs(lastStudy), 'day') >= dayMustRepeat;
            if (valid) content[index].cntRepeat++;
            return valid;
          })
          .map(({ element }) => element);
        if (learnedPath.length <= 0) return;
        const { sheetId } = await this.quizSheetService.attemptRemindQuestion(
          learnedPath,
          String(user),
        );
        console.log('sheetId', sheetId);
        doc.timeScheduler = new Date();
        await Promise.all([
          doc.save(),
          this.notificationService.remindQuestion(String(user), sheetId),
        ]);
      });
  }
  private mapDayMustRepeat: Record<number, Record<number, number>> = {};
  private getDayMustRepeat(nodeId: string, cntRepeat = 1): number {
    const [lv] = slitIdToNumbers(nodeId);
    let dayMustRepeat = this.mapDayMustRepeat[lv]?.[cntRepeat];
    if (dayMustRepeat) return dayMustRepeat;
    const ef = EF_VALUES[lv];
    switch (cntRepeat) {
      case 1:
        dayMustRepeat = 1;
        break;
      case 2:
        dayMustRepeat = 6;
        break;
      default:
        dayMustRepeat = this.getDayMustRepeat(nodeId, cntRepeat - 1) * ef;
        break;
    }
    if (!this.mapDayMustRepeat[lv]) {
      this.mapDayMustRepeat[lv] = {};
    }
    this.mapDayMustRepeat[lv][cntRepeat] = dayMustRepeat;
    return dayMustRepeat;
  }
}
