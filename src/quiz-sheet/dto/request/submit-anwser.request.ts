export class SubmitAnswerRequest {
  sheetId: string;
  questionIdx: number;
  answers: unknown[];
  duration: number;
}
