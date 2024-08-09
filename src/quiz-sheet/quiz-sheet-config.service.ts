import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  QuizSheetConfigContentModel,
  QuizSheetConfigModel,
} from './models/quiz-sheet-config.model';
import { InjectModel } from '@nestjs/mongoose';
import { CourseEntity } from '../database/schema/courses/course.schema';
import { Model } from 'mongoose';
import {
  QUESTION_LEVEL_VALUES,
  REPEAT_CONTENT,
  TARGET_STUDY_PATH,
  TARGET_STUDY_PATH_NODE,
  TIME_UNIT,
} from '../config/constants';
import { AttemptQuizLevelRequest } from './dto/request/attempt-quiz-level.request';
import { slitIdToNumbers } from 'src/utils';

const TARGET_STUDY_PATH_BY_PERIOD = Object.entries(TARGET_STUDY_PATH).reduce(
  (acc, [key, value]) => {
    const [period] = slitIdToNumbers(key);
    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(value);
    return acc;
  },
  {} as Record<number, TARGET_STUDY_PATH_NODE[]>,
);

@Injectable()
export class QuizSheetConfigService {
  constructor(
    @InjectModel(CourseEntity.name) private courseModel: Model<CourseEntity>,
  ) {}
  async getSheetConfigByRange(
    startContent: number[],
    endContent: number[],
  ): Promise<QuizSheetConfigModel> {
    const courseDetail = await this.courseModel.findOne().lean();
    if (!courseDetail) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const { chapters } = courseDetail;
    //filter chapter in range
    const chaptersInRange = chapters.filter(
      (chapter) =>
        chapter.chapterNumber >= startContent[0] &&
        chapter.chapterNumber <= endContent[0],
    );
    if (chaptersInRange.length === 0) {
      throw new HttpException(
        'No chapter found in range',
        HttpStatus.NOT_FOUND,
      );
    }
    const content: QuizSheetConfigContentModel[] = [];
    if (chaptersInRange.length === 1) {
      chaptersInRange[0].figures
        .filter(
          ({ figureNumber }) =>
            figureNumber >= startContent[1] && figureNumber <= endContent[1],
        )
        .forEach(({ figureNumber }) => {
          for (const lv of QUESTION_LEVEL_VALUES) {
            content.push({
              chapter: chaptersInRange[0].chapterNumber,
              figure: figureNumber,
              lv,
              total: 1,
            });
          }
        });
    } else {
      chaptersInRange.at(0).figures = chaptersInRange
        .at(0)
        .figures.filter(({ figureNumber }) => figureNumber >= startContent[1]);
      chaptersInRange.at(-1).figures = chaptersInRange
        .at(-1)
        .figures.filter(({ figureNumber }) => figureNumber <= endContent[1]);
      for (const chapter of chaptersInRange) {
        for (const figure of chapter.figures) {
          for (const lv of QUESTION_LEVEL_VALUES) {
            content.push({
              chapter: chapter.chapterNumber,
              figure: figure.figureNumber,
              lv,
              total: 1,
            });
          }
        }
      }
    }
    return {
      fixDuration: TIME_UNIT.HOUR * 1.5,
      content,
    };
  }
  getSheetByLevel({
    chapter,
    figure,
    level,
  }: AttemptQuizLevelRequest): QuizSheetConfigModel {
    return {
      fixDuration: TIME_UNIT.MINUTE * 30,
      content: [
        {
          chapter,
          figure,
          lv: level,
          total: 4,
        },
      ],
    };
  }
  getSheetEndFigure(figureId: string): QuizSheetConfigModel {
    const figureIdsMustStudy = REPEAT_CONTENT[figureId];
    if (!figureIdsMustStudy) {
      throw new HttpException('Figure not found', HttpStatus.NOT_FOUND);
    }
    const content: QuizSheetConfigContentModel[] = [];
    for (const figureIdMustStudy of figureIdsMustStudy) {
      const [figure, chapter] = slitIdToNumbers(figureIdMustStudy);
      for (const lv of QUESTION_LEVEL_VALUES) {
        content.push({
          chapter,
          figure,
          lv,
          total: 1,
        });
      }
    }
    return {
      fixDuration: TIME_UNIT.HOUR * 1,
      content,
    };
  }
  getSheetByListStudyNode(listStudyNode: string[]): QuizSheetConfigModel {
    const content: QuizSheetConfigContentModel[] = [];
    for (const figureId of listStudyNode) {
      const [figure, chapter] = slitIdToNumbers(figureId);
      for (const lv of QUESTION_LEVEL_VALUES) {
        content.push({
          chapter,
          figure,
          lv,
          total: 1,
        });
      }
    }
    return {
      fixDuration: listStudyNode.length * TIME_UNIT.MINUTE * 10,
      content,
    };
  }
  getSheetTestExam(period: number): QuizSheetConfigModel {
    const periodConfig = TARGET_STUDY_PATH_BY_PERIOD[period];
    if (!periodConfig) {
      throw new HttpException('Period not found', HttpStatus.NOT_FOUND);
    }
    const content: QuizSheetConfigContentModel[] = [];
    for (const { members, point: numberRandomQuestion } of periodConfig) {
      const contentIdMap: Record<string, number> = {};
      for (let i = 0; i < numberRandomQuestion; i++) {
        const randomMember =
          members[Math.floor(Math.random() * members.length)];
        if (!contentIdMap[randomMember]) {
          contentIdMap[randomMember] = 0;
        }
        contentIdMap[randomMember]++;
      }
      for (const [figureId, total] of Object.entries(contentIdMap)) {
        const [lv, figure, chapter] = slitIdToNumbers(figureId);
        content.push({
          chapter,
          figure,
          lv,
          total,
        });
      }
    }
    return {
      fixDuration: TIME_UNIT.HOUR * 2,
      content,
    };
  }
}
