export interface QuizSheetConfigModel {
  fixDuration?: number;
  perDuration?: number;
  content: QuizSheetConfigContentModel[];
}

export interface QuizSheetConfigContentModel {
  chapter: number;
  figure: number;
  lv: number;
  total: number;
}
