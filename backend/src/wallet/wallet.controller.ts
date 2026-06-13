import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Headers,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Request } from 'express';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    [key: string]: unknown;
  };
  headers: any;
  socket: any;
}

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Get('my-wallet')
  async getMyWallet(@Req() req: AuthenticatedRequest) {
    const wallet = await this.walletService.getWallet(req.user.id);
    return { success: true, data: wallet };
  }

  @UseGuards(AuthGuard)
  @Get('transactions')
  async getTransactions(@Req() req: AuthenticatedRequest) {
    const transactions = await this.walletService.getTransactions(req.user.id);
    return { success: true, data: transactions };
  }

  @UseGuards(AuthGuard)
  @Post('deposit')
  async deposit(@Req() req: AuthenticatedRequest, @Body() dto: DepositDto) {
    const ipAddr =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (req.headers['x-forwarded-for'] as string) ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (req.socket?.remoteAddress as string) ||
      '127.0.0.1';

    // Instead of completing deposit instantly, return VNPay URL
    const result = await this.walletService.createDepositUrl(
      req.user.id,
      dto,
      ipAddr,
    );
    return {
      success: true,
      message: 'Đang chuyển hướng đến VNPAY',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Post('withdraw')
  async withdraw(@Req() req: AuthenticatedRequest, @Body() dto: WithdrawDto) {
    const result = await this.walletService.withdraw(req.user.id, dto);
    return {
      success: true,
      message: 'Rút tiền thành công, tiền đã bị trừ',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Post('pay-booking')
  async payBooking(
    @Req() req: AuthenticatedRequest,
    @Body() body: { tourRequestId: string; paymentType: string },
  ) {
    return await this.walletService.payForBooking(
      req.user.id,
      body.tourRequestId,
      body.paymentType,
    );
  }

  // IPN Listener (Không dùng Auth Guard)
  @Get('vnpay-ipn')
  async vnpayIpn(@Query() query: Record<string, string>) {
    return await this.walletService.vnpayIpn(query);
  }
}
