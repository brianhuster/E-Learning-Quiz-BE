import { Test, TestingModule } from '@nestjs/testing';
import { StudyPathService } from './study-path.service';

describe('StudyPathService', () => {
  let service: StudyPathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyPathService],
    }).compile();

    service = module.get<StudyPathService>(StudyPathService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
