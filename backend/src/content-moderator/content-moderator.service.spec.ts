import { Test, TestingModule } from '@nestjs/testing';
import { ContentModeratorService } from './content-moderator.service';
import { PrismaService } from '../prisma/prisma.service';
import { TrustSafetyService } from '../trust-safety/trust-safety.service';

describe('ContentModeratorService', () => {
  let service: ContentModeratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentModeratorService,
        { provide: PrismaService, useValue: {} },
        { provide: TrustSafetyService, useValue: {} },
      ],
    }).compile();

    service = module.get<ContentModeratorService>(ContentModeratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
