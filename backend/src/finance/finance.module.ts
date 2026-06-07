import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { ReconciliationService } from './reconciliation.service';
import { InvoiceService } from './invoice.service';
import { CashflowForecastingService } from './cashflow-forecasting.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [FinanceController],
  providers: [
    ReconciliationService,
    InvoiceService,
    CashflowForecastingService,
  ],
})
export class FinanceModule {}
