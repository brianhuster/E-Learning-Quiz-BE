import { PartialType } from '@nestjs/swagger';
import { QuizAnswerSheetEntity } from 'src/database/schema/quiz-answers/quiz-answers.schema';

export class GetQuizSheetResponse extends PartialType(QuizAnswerSheetEntity) {}
