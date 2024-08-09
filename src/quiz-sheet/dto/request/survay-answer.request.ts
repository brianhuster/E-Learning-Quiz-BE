export class SubmitAnswerSurveyRequest {
  sheetId: string;
  questionIdx: number;
  isWeak?: boolean;
  isRandom?: boolean;
}
