import path from '../../data/study-path.json';
import repeat_content from '../../data/repeat_content.json';
import target_study_path from '../../data/target-study-path.json';

export interface STUDY_PATH_NODE {
  time: number;
  children: string[];
  parent: string[];
}

export interface TARGET_STUDY_PATH_NODE {
  members: string[];
  point: number;
}

export const TARGET_STUDY_PATH: Record<string, TARGET_STUDY_PATH_NODE> =
  target_study_path;

export const REPEAT_CONTENT: Record<string, string[]> = repeat_content;

export const MAX_HOUSE_PER_DAY = 14;

export const STUDY_REVIEW_RATIO = 1 / 2;

export const STUDY_PATH: Record<string, STUDY_PATH_NODE> = path;

export enum TypeQuizQuestion {
  MULTIPLE_CHOICE = 0,
  TRUE_FALSE = 1,
  FILL_IN_THE_BLANK = 2,
}

export const QUESTION_LEVEL = {
  RECOGNIZE: 1,
  UNDERSTAND: 2,
  APPLY: 3,
  ANALYZE: 4,
};

// create const for number of Question level
export const NUMBER_QUESTION_LEVEL = Object.keys(QUESTION_LEVEL).length;

export const QUESTION_LEVEL_VALUES = Object.values(QUESTION_LEVEL);

export enum QUIZ_SHEET_CONFIG_TYPE {
  INPUT = 0,
  LEVEL = 1,
  FIGURE = 2,
  REMIND = 3,
}

export const TIME_UNIT = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

export const NOTIFICATION_TYPE = {
  REPORT_QUESTION: 1,
  REMIND_QUESTION: 2,
};

export const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};

export const TOKEN_EXPIRES_IN = TIME_UNIT.DAY * 7;

export const RATIO_TO_PASS = 0.7;

export const EF_VALUES = {
  [QUESTION_LEVEL.RECOGNIZE]: 2.5,
  [QUESTION_LEVEL.UNDERSTAND]: 2.1,
  [QUESTION_LEVEL.APPLY]: 1.7,
  [QUESTION_LEVEL.ANALYZE]: 1.3,
};
