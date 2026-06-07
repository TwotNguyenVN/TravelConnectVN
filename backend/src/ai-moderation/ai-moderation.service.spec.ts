import { Test, TestingModule } from '@nestjs/testing';
import { AiModerationService } from './ai-moderation.service';
import { ConfigService } from '@nestjs/config';

describe('AiModerationService', () => {
  let service: AiModerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiModerationService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-api-key') },
        },
      ],
    }).compile();

    service = module.get<AiModerationService>(AiModerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
