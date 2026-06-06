import { Test, TestingModule } from '@nestjs/testing';
import { AiModerationService } from './ai-moderation.service';

describe('AiModerationService', () => {
  let service: AiModerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiModerationService],
    }).compile();

    service = module.get<AiModerationService>(AiModerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
