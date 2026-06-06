import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { ReconciliationService, StatementRow } from './reconciliation.service';
import { InvoiceService } from './invoice.service';
import { CashflowForecastingService } from './cashflow-forecasting.service';

@Controller('finance')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(
    private readonly reconciliationService: ReconciliationService,
    private readonly invoiceService: InvoiceService,
    private readonly forecastingService: CashflowForecastingService,
  ) {}

  @Post('reconcile')
  async reconcile(@Body('statementRows') statementRows: StatementRow[]) {
    return this.reconciliationService.reconcileTransactions(statementRows || []);
  }

  @Post('invoices/generate/:paymentTransactionId')
  async generateInvoice(@Param('paymentTransactionId') paymentTransactionId: string) {
    return this.invoiceService.generateInvoice(paymentTransactionId);
  }

  @Get('forecasting')
  async getForecasting(@Query('days') days: string) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.forecastingService.getForecast(parsedDays);
  }
}
