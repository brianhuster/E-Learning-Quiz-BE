import { Test, TestingModule } from '@nestjs/testing';
import { StudyPathController } from './study-path.controller';
import { StudyPathService } from './study-path.service';

describe('StudyPathController', () => {
  let controller: StudyPathController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyPathController],
      providers: [StudyPathService],
    }).compile();

    controller = module.get<StudyPathController>(StudyPathController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
