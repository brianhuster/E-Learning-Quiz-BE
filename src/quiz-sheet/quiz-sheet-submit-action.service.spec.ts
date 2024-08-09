import { Test, TestingModule } from '@nestjs/testing';
import { QuizSheetSubmitActionService } from './quiz-sheet-submit-action.service';

describe('QuizSheetSubmitActionService', () => {
  let service: QuizSheetSubmitActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizSheetSubmitActionService],
    }).compile();

    service = module.get<QuizSheetSubmitActionService>(
      QuizSheetSubmitActionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
