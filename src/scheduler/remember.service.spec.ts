import { Test, TestingModule } from '@nestjs/testing';
import { RememberService } from './remember.service';

describe('RememberService', () => {
  let service: RememberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RememberService],
    }).compile();

    service = module.get<RememberService>(RememberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
