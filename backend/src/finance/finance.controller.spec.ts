import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from './finance.controller';
import { ReconciliationService } from './reconciliation.service';
import { InvoiceService } from './invoice.service';
import { CashflowForecastingService } from './cashflow-forecasting.service';

describe('FinanceController', () => {
  let controller: FinanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [
        { provide: ReconciliationService, useValue: {} },
        { provide: InvoiceService, useValue: {} },
        { provide: CashflowForecastingService, useValue: {} },
      ],
    }).compile();

    controller = module.get<FinanceController>(FinanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
