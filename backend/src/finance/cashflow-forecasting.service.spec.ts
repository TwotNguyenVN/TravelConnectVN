import { Test, TestingModule } from '@nestjs/testing';
import { CashflowForecastingService } from './cashflow-forecasting.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CashflowForecastingService', () => {
  let service: CashflowForecastingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashflowForecastingService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<CashflowForecastingService>(CashflowForecastingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
