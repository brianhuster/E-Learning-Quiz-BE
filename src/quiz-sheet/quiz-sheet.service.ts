import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import * as _ from 'lodash';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GetQuizSheetResponse } from './dto/response/get-quiz-sheet.response';
import {
  QuizAnswerSheetDocument,
  QuizAnswerSheetEntity,
} from 'src/database/schema/quiz-answers/quiz-answers.schema';
import { QuizSheetConfigService } from 'src/quiz-sheet/quiz-sheet-config.service';
import { QuizQuestionEntity } from 'src/database/schema/quiz-questions/quiz-question.schema';
import { CreateQuizSheetResponse } from './dto/response/create-quiz-sheet.response';
import { SubmitQuizSheetResponse } from './dto/response/submit-quiz-sheet.response';
import { SubmitAnswerRequest } from './dto/request/submit-anwser.request';
import { SubmitAnswerSurveyRequest } from './dto/request/survay-answer.request';
import { QUIZ_SHEET_CONFIG_TYPE } from 'src/config/constants';
import { QuizSheetConfigModel } from './models/quiz-sheet-config.model';
import { QuizSheetSubmitActionService } from './quiz-sheet-submit-action.service';
import { AttemptQuizLevelRequest } from './dto/request/attempt-quiz-level.request';
import { slitIdToNumbers } from 'src/utils';

@Injectable()
export class QuizSheetService {
  constructor(
    @InjectModel(QuizAnswerSheetEntity.name)
    private readonly quizSheetModel: Model<QuizAnswerSheetEntity>,
    @InjectModel(QuizQuestionEntity.name)
    private readonly quizQuestionModel: Model<QuizQuestionEntity>,
    private readonly quizSheetConfigService: QuizSheetConfigService,
    private readonly quizSheetSubmitActionService: QuizSheetSubmitActionService,
  ) {}

  private async getQuestionIdsFromConfig(
    config: QuizSheetConfigModel,
  ): Promise<ObjectId[]> {
    const { content } = config;
    const questionPromises = content.map((config) => {
      const { figure, chapter, lv: level, total } = config;
      //get random questions from chapter
      return this.quizQuestionModel
        .aggregate()
        .match({ chapter, figure, level })
        .sample(total)
        .project({ _id: 1 })
        .exec();
    });

    const questions = await Promise.all(questionPromises);
    const questionIds = questions.flat().map(({ _id }) => _id);
    return questionIds;
  }

  private getCreateQuizSheetResponse(
    quizSheet: QuizAnswerSheetDocument,
  ): CreateQuizSheetResponse {
    return {
      sheetId: quizSheet._id.toString(),
      createdAt: quizSheet.createdAt,
      quizDuration: quizSheet.quizDuration,
    };
  }

  async attemptQuizInput(
    studiedChapter: number[],
    studyPathId: string,
    userId: string,
  ): Promise<CreateQuizSheetResponse> {
    const sheetConfig = await this.quizSheetConfigService.getSheetConfigByRange(
      [2, 1],
      studiedChapter,
    );
    //TODO: Get questions
    const { fixDuration: quizDuration } = sheetConfig;
    const questionIds = await this.getQuestionIdsFromConfig(sheetConfig);
    //TODO: Create new sheet
    const newSheet = new this.quizSheetModel({
      user: new Types.ObjectId(userId),
      studyPath: new Types.ObjectId(studyPathId),
      configType: QUIZ_SHEET_CONFIG_TYPE.INPUT,
      quizDuration,
      questions: questionIds.map((question) => ({
        question,
        histories: [],
        correct: false,
      })),
    });
    await newSheet.save();
    return this.getCreateQuizSheetResponse(newSheet);
  }

  async attemptQuizLevel(
    userId: string,
    config: AttemptQuizLevelRequest,
  ): Promise<CreateQuizSheetResponse> {
    const sheetConfig = this.quizSheetConfigService.getSheetByLevel(config);
    const questionIds = await this.getQuestionIdsFromConfig(sheetConfig);
    const newSheet = new this.quizSheetModel({
      chapter: config.chapter,
      figure: config.figure,
      level: config.level,
      user: new Types.ObjectId(userId),
      configType: QUIZ_SHEET_CONFIG_TYPE.LEVEL,
      quizDuration: sheetConfig.fixDuration,
      questions: questionIds.map((question) => ({
        question,
        histories: [],
        correct: false,
      })),
    });
    await newSheet.save();
    return this.getCreateQuizSheetResponse(newSheet);
  }

  async attemptQuizEndFigure(
    figureId: string,
    userId: string,
  ): Promise<CreateQuizSheetResponse> {
    const sheetConfig = this.quizSheetConfigService.getSheetEndFigure(figureId);
    const questionIds = await this.getQuestionIdsFromConfig(sheetConfig);
    const [figure, chapter] = slitIdToNumbers(figureId);
    const newSheet = new this.quizSheetModel({
      chapter,
      figure,
      user: new Types.ObjectId(userId),
      configType: QUIZ_SHEET_CONFIG_TYPE.FIGURE,
      quizDuration: sheetConfig.fixDuration,
      questions: questionIds.map((question) => ({
        question,
        histories: [],
        correct: false,
      })),
    });
    await newSheet.save();
    return this.getCreateQuizSheetResponse(newSheet);
  }

  async attemptRemindQuestion(
    listStudyNode: string[],
    userId: string,
  ): Promise<CreateQuizSheetResponse> {
    const sheetConfig =
      this.quizSheetConfigService.getSheetByListStudyNode(listStudyNode);
    const questionIds = await this.getQuestionIdsFromConfig(sheetConfig);
    const newSheet = new this.quizSheetModel({
      user: new Types.ObjectId(userId),
      configType: QUIZ_SHEET_CONFIG_TYPE.REMIND,
      quizDuration: sheetConfig.fixDuration,
      questions: questionIds.map((question) => ({
        question,
        histories: [],
        correct: false,
      })),
    });
    await newSheet.save();
    return this.getCreateQuizSheetResponse(newSheet);
  }

  async attemptQuizTestExam(period: number, userId: string) {
    const sheetConfig = this.quizSheetConfigService.getSheetTestExam(period);
    const questionIds = await this.getQuestionIdsFromConfig(sheetConfig);
    const newSheet = new this.quizSheetModel({
      user: new Types.ObjectId(userId),
      configType: QUIZ_SHEET_CONFIG_TYPE.REMIND,
      quizDuration: sheetConfig.fixDuration,
      questions: questionIds.map((question) => ({
        question,
        histories: [],
        correct: false,
      })),
    });
    await newSheet.save();
    return this.getCreateQuizSheetResponse(newSheet);
  }

  async getQuizSheet(
    sheetId: string,
    omitKey = false,
  ): Promise<GetQuizSheetResponse> {
    const quizSheet: QuizAnswerSheetEntity = await this.quizSheetModel
      .findById(sheetId)
      .populate('questions.question', '', this.quizQuestionModel)
      .lean();
    if (!quizSheet)
      throw new HttpException('Không tìm thấy bài làm', HttpStatus.NOT_FOUND);
    //Omit answers in sheet
    if (omitKey)
      quizSheet.questions.forEach(({ question }) => {
        question.config.answers = [];
      });
    return quizSheet as GetQuizSheetResponse;
  }

  async submitQuestion({
    sheetId,
    questionIdx,
    answers: userAnswers,
    duration,
  }: SubmitAnswerRequest) {
    const quizSheet = await this.quizSheetModel
      .findById(sheetId)
      .slice('questions', [questionIdx, 1])
      .populate('questions.question', 'config.answers', this.quizQuestionModel)
      .lean();
    if (!quizSheet || !quizSheet.questions.length)
      throw new HttpException('Not found question', HttpStatus.NOT_FOUND);
    const [questionInfo] = quizSheet.questions;
    const {
      question: {
        config: { answers },
      },
    } = questionInfo;
    const isCorrect = _.isEqual(_.sortBy(userAnswers), _.sortBy(answers));
    await this.quizSheetModel.updateOne(
      {
        _id: new Types.ObjectId(sheetId),
      },
      {
        $set: {
          [`questions.${questionIdx}.correct`]: isCorrect,
        },
        $push: {
          [`questions.${questionIdx}.histories`]: {
            duration,
            answers: userAnswers,
            correct: isCorrect,
          },
        },
      },
    );
  }

  async submitQuizSheet(
    sheetId: string,
    userId: string,
  ): Promise<SubmitQuizSheetResponse> {
    const quizSheet = await this.quizSheetModel
      .findOne({
        _id: new Types.ObjectId(sheetId),
        user: new Types.ObjectId(userId),
        submittedAt: null,
      })
      .populate('questions.question');
    if (!quizSheet)
      throw new HttpException(
        'Không tìm thấy bài kiểm tra của bạn',
        HttpStatus.NOT_FOUND,
      );
    const correctAnswers = quizSheet.questions.filter(({ correct }) => correct);
    const totalScore = correctAnswers.reduce(
      (acc, { question }) => acc + question.point,
      0,
    );
    const { configType } = quizSheet;
    await this.quizSheetSubmitActionService.getHandler(configType)(quizSheet);
    await quizSheet.updateOne({ score: totalScore, submittedAt: new Date() });

    return {
      sheetId,
      score: totalScore,
      correctAnswers: correctAnswers.length,
    };
  }

  async submitAnswerSurvey({
    questionIdx,
    isRandom,
    isWeak,
    sheetId,
  }: SubmitAnswerSurveyRequest) {
    const quizSheet = await this.quizSheetModel.findById(sheetId);
    const questionConfig = quizSheet.questions.at(questionIdx);
    if (!questionConfig)
      throw new HttpException('Not found question', HttpStatus.NOT_FOUND);
    questionConfig.isRandom = isRandom;
    questionConfig.isWeak = isWeak;
    await quizSheet.save();
  }
}
