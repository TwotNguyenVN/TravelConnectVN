import { Test, TestingModule } from '@nestjs/testing';
import { GuideVerificationService } from './guide-verification.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

describe('GuideVerificationService', () => {
  let service: GuideVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuideVerificationService,
        { provide: PrismaService, useValue: {} },
        { provide: UserActivityLogsService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<GuideVerificationService>(GuideVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
