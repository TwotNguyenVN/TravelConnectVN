import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private sortObject(obj: any): any {
    const sorted: Record<string, string> = {};
    const str: string[] = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  // 1. Tạo URL thanh toán VNPAY
  async createPaymentUrl(userId: string, tourRequestId: string, ipAddr: string) {
    try {
      // Tìm thông tin yêu cầu tour
      const request = await this.prisma.tour_requests.findUnique({
        where: { id: tourRequestId },
        include: { tours: true },
      });

      if (!request) throw new NotFoundException('Yêu cầu không tồn tại');
      if (request.user_id !== userId) throw new BadRequestException('Bạn không có quyền thanh toán yêu cầu này');
      if (request.status !== 'approved' && request.status !== 'pending') throw new BadRequestException('Trạng thái yêu cầu không hợp lệ để thanh toán');

      // Tạo giao dịch nội bộ
      const transactionId = crypto.randomUUID(); // Dùng uuid ngẫu nhiên làm mã đơn nội bộ
      const amount = Number(request.tours.price) * request.participant_count;

      await this.prisma.payment_transactions.create({
        data: {
          id: transactionId,
          tour_request_id: tourRequestId,
          user_id: userId,
          amount: amount,
          payment_method: 'vnpay',
          status: 'pending',
          transaction_code: transactionId, // Dùng làm vnp_TxnRef
        },
      });

      // Tạo tham số VNPAY
      const tmnCode = process.env.VNP_TMNCODE;
      const secretKey = process.env.VNP_HASHSECRET;
      let vnpUrl = process.env.VNP_URL;
      const returnUrl = process.env.VNP_RETURN_URL;

      const date = new Date();
      const createDate = 
        date.getFullYear().toString() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      let vnp_Params: any = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      vnp_Params['vnp_Locale'] = 'vn';
      vnp_Params['vnp_CurrCode'] = 'VND';
      vnp_Params['vnp_TxnRef'] = transactionId;
      vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + transactionId;
      vnp_Params['vnp_OrderType'] = 'other';
      vnp_Params['vnp_Amount'] = amount * 100; // VNPAY yêu cầu nhân 100
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;

      vnp_Params = this.sortObject(vnp_Params);
      let signData = '';
      for (const key in vnp_Params) {
        if (vnp_Params.hasOwnProperty(key)) {
          signData += key + '=' + vnp_Params[key] + '&';
        }
      }
      signData = signData.slice(0, -1);

      const hmac = crypto.createHmac('sha512', secretKey || '');
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;

      vnpUrl += '?' + signData + '&vnp_SecureHash=' + signed;

      return { paymentUrl: vnpUrl };
    } catch (error) {
      console.error('Error creating payment:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create payment URL');
    }
  }

  // 2. IPN Listener (Dùng để VNPAY gọi về báo kết quả ngầm)
  async vnpayIpn(vnp_Params: any) {
    try {
      console.log("IPN Params:", vnp_Params); let secureHash = vnp_Params['vnp_SecureHash'];
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
        const orderId = vnp_Params['vnp_TxnRef'];
        const rspCode = vnp_Params['vnp_ResponseCode'];

        // Tìm transaction
        const transaction = await this.prisma.payment_transactions.findUnique({
          where: { id: orderId }
        });

        if (!transaction) {
          return { RspCode: '01', Message: 'Order not found' };
        }

        if (transaction.status === 'paid' || transaction.status === 'failed') {
          return { RspCode: '02', Message: 'Order already confirmed' };
        }

        const isSuccess = rspCode === '00';
        const newStatus = isSuccess ? 'paid' : 'failed';

        // Cập nhật Database (Dùng transaction của Prisma để đảm bảo đồng bộ)
        await this.prisma.$transaction([
          this.prisma.payment_transactions.update({
            where: { id: orderId },
            data: { status: newStatus }
          }),
          ...(isSuccess ? [
            this.prisma.tour_requests.update({
              where: { id: transaction.tour_request_id },
              data: { status: 'paid' }
            })
          ] : [])
        ]);

        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        return { RspCode: '97', Message: 'Invalid Checksum' };
      }
    } catch (error: any) {
      console.error('IPN Error:', error);
      return { RspCode: '99', Message: error?.message || 'Unknown error', ReceivedParams: vnp_Params };
    }
  }

  // 3. Lấy lịch sử giao dịch
  async getMyTransactions(userId: string) {
    return this.prisma.payment_transactions.findMany({
      where: { user_id: userId },
      include: {
        tour_requests: {
          include: { tours: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getPaymentById(userId: string, id: string) {
    const transaction = await this.prisma.payment_transactions.findUnique({
      where: { id },
      include: {
        tour_requests: {
          include: { tours: true }
        }
      }
    });

    if (!transaction || transaction.user_id !== userId) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    return transaction;
  }
}
