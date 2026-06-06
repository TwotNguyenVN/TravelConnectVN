import { Test, TestingModule } from '@nestjs/testing';
import { TrustSafetyService } from './trust-safety.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TrustSafetyService', () => {
  let service: TrustSafetyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrustSafetyService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TrustSafetyService>(TrustSafetyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
