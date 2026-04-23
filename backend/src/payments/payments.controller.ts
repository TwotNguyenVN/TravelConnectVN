import { Controller, Post, Get, Body, Req, UseGuards, Query, Param } from '@nestjs/common';
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
    @Body('tourRequestId') tourRequestId: string
  ) {
    const userId = (req as any).user.id;
    // VNPAY cần IP Address của user thực hiện thanh toán
    const ipAddr = req.headers['x-forwarded-for'] ||
                   req.socket.remoteAddress || 
                   '127.0.0.1';

    const data = await this.paymentsService.createPaymentUrl(userId, tourRequestId, ipAddr as string);
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
}
