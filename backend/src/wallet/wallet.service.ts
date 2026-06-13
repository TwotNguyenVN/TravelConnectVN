import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import * as crypto from 'crypto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  private sortObject(obj: Record<string, any>): Record<string, string> {
    const sorted: Record<string, string> = {};
    const str: string[] = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (let i = 0; i < str.length; i++) {
      sorted[str[i]] = encodeURIComponent(String(obj[str[i]])).replace(
        /%20/g,
        '+',
      );
    }
    return sorted;
  }

  async getWallet(userId: string) {
    let wallet = await this.prisma.user_wallets.findUnique({
      where: { user_id: userId },
    });

    if (!wallet) {
      wallet = await this.prisma.user_wallets.create({
        data: { user_id: userId },
      });
    }
    return wallet;
  }

  async getTransactions(userId: string) {
    const wallet = await this.getWallet(userId);
    return this.prisma.wallet_transactions.findMany({
      where: { wallet_id: wallet.id },
      orderBy: { created_at: 'desc' },
    });
  }

  async createDepositUrl(userId: string, dto: DepositDto, ipAddr: string) {
    if (dto.amount <= 0)
      throw new BadRequestException('Số tiền nạp phải lớn hơn 0');

    const wallet = await this.getWallet(userId);

    // Tạo transaction pending
    const transactionId = crypto.randomUUID();
    await this.prisma.wallet_transactions.create({
      data: {
        id: transactionId,
        wallet_id: wallet.id,
        transaction_type: 'deposit',
        amount: dto.amount,
        status: 'pending',
        description: dto.description || 'Nạp tiền vào ví',
        reference_id: transactionId, // Dùng làm vnp_TxnRef
      },
    });

    // Tạo tham số VNPAY
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL
      ? process.env.VNP_RETURN_URL.replace(
          '/user/payments/vnpay-return',
          '/user/wallet/vnpay-return',
        )
      : 'http://localhost:5173/user/wallet/vnpay-return';

    const date = new Date();
    const createDate =
      date.getFullYear().toString() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    let vnp_Params: Record<string, string | number> = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode || '';
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = transactionId;
    vnp_Params['vnp_OrderInfo'] = 'Nap tien vao vi ' + transactionId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = dto.amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl || '';
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = this.sortObject(vnp_Params);
    let signData = '';
    for (const key in vnp_Params) {
      if (Object.prototype.hasOwnProperty.call(vnp_Params, key)) {
        signData += key + '=' + vnp_Params[key] + '&';
      }
    }
    signData = signData.slice(0, -1);

    const hmac = crypto.createHmac('sha512', secretKey || '');
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    vnpUrl += '?' + signData + '&vnp_SecureHash=' + signed;

    return { paymentUrl: vnpUrl };
  }

  async vnpayIpn(vnp_Params: Record<string, string | number>) {
    try {
      const secureHash = String(vnp_Params['vnp_SecureHash'] || '');
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = this.sortObject(vnp_Params);

      let signData = '';
      for (const key in vnp_Params) {
        if (Object.prototype.hasOwnProperty.call(vnp_Params, key)) {
          signData += key + '=' + vnp_Params[key] + '&';
        }
      }
      signData = signData.slice(0, -1);

      const secretKey = process.env.VNP_HASHSECRET;
      const hmac = crypto.createHmac('sha512', secretKey || '');
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash === signed) {
        const orderId = vnp_Params['vnp_TxnRef'] as string;
        const rspCode = vnp_Params['vnp_ResponseCode'] as string;

        // Tìm transaction
        const transaction = await this.prisma.wallet_transactions.findUnique({
          where: { id: orderId },
        });

        if (!transaction || transaction.transaction_type !== 'deposit') {
          return { RspCode: '01', Message: 'Order not found' };
        }

        const vnpAmount = Number(vnp_Params['vnp_Amount']) / 100;
        if (vnpAmount !== Number(transaction.amount)) {
          return { RspCode: '04', Message: 'Invalid amount' };
        }

        if (
          transaction.status === 'completed' ||
          transaction.status === 'failed'
        ) {
          return { RspCode: '02', Message: 'Order already confirmed' };
        }

        const isSuccess = rspCode === '00';
        const newStatus = isSuccess ? 'completed' : 'failed';

        // Cập nhật Database
        await this.prisma.$transaction(async (tx) => {
          await tx.wallet_transactions.update({
            where: { id: orderId },
            data: { status: newStatus },
          });

          if (isSuccess) {
            await tx.user_wallets.update({
              where: { id: transaction.wallet_id },
              data: { balance: { increment: transaction.amount } },
            });
          }
        });

        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        return { RspCode: '97', Message: 'Invalid Checksum' };
      }
    } catch (error) {
      console.error('IPN Error:', error);
      return { RspCode: '99', Message: 'Unknown error' };
    }
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    if (dto.amount <= 0)
      throw new BadRequestException('Số tiền rút phải lớn hơn 0');

    const wallet = await this.getWallet(userId);

    if (Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Số dư trong ví không đủ');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo request rút tiền
      const transaction = await tx.wallet_transactions.create({
        data: {
          wallet_id: wallet.id,
          transaction_type: 'withdraw',
          amount: -dto.amount,
          status: 'completed', // Rút tiền và trừ ngay lập tức
          description: dto.description || 'Yêu cầu rút tiền',
        },
      });

      // 2. Trừ tiền luôn
      const updatedWallet = await tx.user_wallets.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: dto.amount },
          updated_at: new Date(),
        },
      });

      return { transaction, wallet: updatedWallet };
    });
  }

  async payForBooking(
    userId: string,
    tourRequestId: string,
    paymentType: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin Tour Request
      const tourRequest = await tx.tour_requests.findUnique({
        where: { id: tourRequestId },
        include: { tours: true },
      });

      if (!tourRequest || tourRequest.user_id !== userId) {
        throw new BadRequestException(
          'Yêu cầu đặt tour không tồn tại hoặc không hợp lệ',
        );
      }

      // 2. Tính toán số tiền
      let price = Number(tourRequest.tours.price);
      if (tourRequest.price_at_booking) {
        price = Number(tourRequest.price_at_booking);
      } else if (tourRequest.schedule_id) {
        const schedule = await tx.tour_schedules.findUnique({
          where: { id: tourRequest.schedule_id },
        });
        if (schedule) price = Number(schedule.price);
      }

      let amount = price * tourRequest.participant_count;
      if (paymentType === 'deposit') {
        amount = amount * 0.5;
      }

      // 3. Lấy ví người dùng
      const wallet = await tx.user_wallets.findUnique({
        where: { user_id: userId },
      });

      if (!wallet) {
        throw new BadRequestException('Không tìm thấy ví người dùng');
      }

      if (Number(wallet.balance) < amount) {
        throw new BadRequestException('Số dư trong ví không đủ để thanh toán');
      }

      // 4. Tạo payment_transactions
      const paymentTransactionId = crypto.randomUUID();
      await tx.payment_transactions.create({
        data: {
          id: paymentTransactionId,
          tour_request_id: tourRequestId,
          user_id: userId,
          amount: amount,
          payment_method: 'wallet',
          status: 'paid',
          transaction_code: paymentTransactionId,
          paid_at: new Date(),
        },
      });

      // 5. Cập nhật tour_requests
      const targetStatus =
        paymentType === 'deposit' ? 'partially_paid' : 'paid';
      await tx.tour_requests.update({
        where: { id: tourRequestId },
        data: { status: targetStatus },
      });

      // 6. Ghi nhận giao dịch ví (wallet_transactions)
      const walletTransaction = await tx.wallet_transactions.create({
        data: {
          wallet_id: wallet.id,
          transaction_type: 'payment',
          amount: -amount,
          status: 'completed',
          description: `Thanh toán tour ${tourRequest.tours.title} - Mã yêu cầu: ${tourRequestId.split('-')[0]}`,
        },
      });

      // 7. Cập nhật số dư và tổng chi tiêu
      const updatedWallet = await tx.user_wallets.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
          total_spent: { increment: amount },
          updated_at: new Date(),
        },
      });

      return {
        success: true,
        message: 'Thanh toán thành công qua ví',
        walletTransaction,
        wallet: updatedWallet,
      };
    });
  }
}
