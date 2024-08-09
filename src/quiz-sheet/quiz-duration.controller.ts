import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuizSheetService } from './quiz-sheet.service';
import { SubmitAnswerRequest } from './dto/request/submit-anwser.request';
import { SubmitQuizSheetRequest } from './dto/request/submit-quiz-sheet.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetQuizSheetResponse } from './dto/response/get-quiz-sheet.response';
import { SubmitQuizSheetResponse } from './dto/response/submit-quiz-sheet.response';
import { SubmitAnswerSurveyRequest } from './dto/request/survay-answer.request';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/types/types';
import { AttemptQuizLevelRequest } from './dto/request/attempt-quiz-level.request';

@ApiTags('Quiz')
@UseGuards(AuthGuard)
@Controller('quiz')
export class QuizDurationController {
  constructor(private readonly quizSheetService: QuizSheetService) {}

  @ApiOperation({ summary: 'Join a quiz check input' })
  @Post('/input')
  joinQuizInput(
    @Body() body: { studiedChapter: number[]; studyPathId: string },
    @Req() req: RequestWithUser,
  ) {
    return this.quizSheetService.attemptQuizInput(
      body.studiedChapter,
      body.studyPathId,
      req.user.id,
    );
  }
  @ApiOperation({ summary: 'Join a quiz check level' })
  @Post('/level')
  joinQuizLevel(
    @Body() body: AttemptQuizLevelRequest,
    @Req() req: RequestWithUser,
  ) {
    return this.quizSheetService.attemptQuizLevel(req.user.id, body);
  }

  @ApiOperation({ summary: 'Join a quiz end figure' })
  @Post('/end-figure')
  joinQuizEndFigure(
    @Body() body: { figureId: string },
    @Req() req: RequestWithUser,
  ) {
    return this.quizSheetService.attemptQuizEndFigure(
      body.figureId,
      req.user.id,
    );
  }

  @ApiOperation({ summary: 'Join a quiz test exam' })
  @Post('/test-exam')
  joinQuizTestExam(
    @Body() body: { period: number },
    @Req() req: RequestWithUser,
  ) {
    return this.quizSheetService.attemptQuizTestExam(body.period, req.user.id);
  }

  @ApiOperation({ summary: 'Get a quiz session' })
  @Get('/:id')
  getQuizSession(@Param('id') sheetId: string): Promise<GetQuizSheetResponse> {
    return this.quizSheetService.getQuizSheet(sheetId);
  }

  @ApiOperation({ summary: 'Submit a quiz' })
  @Patch()
  submitQuiz(
    @Body() body: SubmitQuizSheetRequest,
    @Req() req: RequestWithUser,
  ): Promise<SubmitQuizSheetResponse> {
    return this.quizSheetService.submitQuizSheet(body.sheetId, req.user.id);
  }

  @ApiOperation({ summary: 'Submit an answer' })
  @Put()
  submitAnswer(@Body() body: SubmitAnswerRequest): Promise<void> {
    return this.quizSheetService.submitQuestion(body);
  }

  @ApiOperation({ summary: 'Submit survey' })
  @Patch('/survey')
  submitSurvey(@Body() body: SubmitAnswerSurveyRequest): Promise<void> {
    return this.quizSheetService.submitAnswerSurvey(body);
  }
}
