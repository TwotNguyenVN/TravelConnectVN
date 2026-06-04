import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Query,
  Param,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../common/guards/auth.guard';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post('create-vnpay-url')
  async createPaymentUrl(
    @Req() req: Request,
    @Body('tourRequestId') tourRequestId: string,
    @Body('paymentType') paymentType: 'full' | 'deposit' = 'full',
  ) {
    const userId = (req as any).user.id;
    // VNPAY cần IP Address của user thực hiện thanh toán
    const ipAddr =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const data = await this.paymentsService.createPaymentUrl(
      userId,
      tourRequestId,
      ipAddr as string,
      paymentType,
    );
    return {
      success: true,
      message: 'Tạo URL thanh toán thành công',
      data: data,
    };
  }

  // IPN Endpoint (Không dùng Auth Guard vì VNPAY gọi server-to-server)
  @Get('vnpay-ipn')
  async vnpayIpn(@Query() query: any) {
    const result = await this.paymentsService.vnpayIpn(query);
    return result; // Phải trả về chuẩn RspCode và Message theo tài liệu VNPAY
  }

  @UseGuards(AuthGuard)
  @Get('my-transactions')
  async getMyTransactions(@Req() req: Request) {
    const userId = (req as any).user.id;
    const data = await this.paymentsService.getMyTransactions(userId);
    return {
      success: true,
      message: 'Lấy lịch sử giao dịch thành công',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('forecast/cashflow')
  async getCashFlowForecast() {
    const data = await this.paymentsService.getCashFlowForecast();
    return {
      success: true,
      message: 'Lấy dự báo dòng tiền thành công',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getPaymentById(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.id;
    const data = await this.paymentsService.getPaymentById(userId, id);
    return {
      success: true,
      message: 'Lấy chi tiết giao dịch thành công',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id/invoice')
  async getInvoiceData(@Param('id') id: string) {
    const data = await this.paymentsService.generateInvoiceData(id);
    return {
      success: true,
      message: 'Tạo dữ liệu hóa đơn thành công',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id/invoice/pdf')
  async getInvoicePdf(@Param('id') id: string, @Res() res: any) {
    try {
      const pdfBuffer = await this.paymentsService.generatePdfInvoiceBuffer(id);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ success: false, message: 'Failed to generate PDF' });
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/cancel')
  async cancelTransaction(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.id;
    const data = await this.paymentsService.cancelTransaction(userId, id);
    return {
      success: true,
      message: 'Hủy giao dịch thành công',
      data: data,
    };
  }
}
