import { Test, TestingModule } from '@nestjs/testing';
import { GuideVerificationService } from './guide-verification.service';

describe('GuideVerificationService', () => {
  let service: GuideVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuideVerificationService],
    }).compile();

    service = module.get<GuideVerificationService>(GuideVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
