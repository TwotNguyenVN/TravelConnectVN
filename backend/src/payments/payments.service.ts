import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';
import { SocketGateway } from '../socket/socket.gateway';
import { MailService } from '../mail/mail.service';
import PDFDocument from 'pdfkit';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly socketGateway: SocketGateway,
    private readonly mailService: MailService,
    @InjectQueue('mailQueue') private mailQueue: Queue,
  ) {}

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

  // 1. Tạo URL thanh toán VNPAY
  async createPaymentUrl(
    userId: string,
    tourRequestId: string,
    ipAddr: string,
    paymentType: 'full' | 'deposit' = 'full',
  ) {
    try {
      // Tìm thông tin yêu cầu tour
      const request = await this.prisma.tour_requests.findUnique({
        where: { id: tourRequestId },
        include: { tours: true },
      });

      if (!request) throw new NotFoundException('Yêu cầu không tồn tại');
      if (request.user_id !== userId)
        throw new BadRequestException(
          'Bạn không có quyền thanh toán yêu cầu này',
        );
      if (request.status !== 'approved' && request.status !== 'paid') {
        throw new BadRequestException(
          'Trạng thái yêu cầu không hợp lệ để thanh toán (Yêu cầu cần được duyệt trước)',
        );
      }

      // Kiểm tra số tiền đã thanh toán từ trước
      const paidTransactions = await this.prisma.payment_transactions.findMany({
        where: {
          tour_request_id: tourRequestId,
          status: 'paid',
        },
      });
      const totalPaid = paidTransactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0,
      );
      const price = request.price_at_booking
        ? Number(request.price_at_booking)
        : request.schedule_id
          ? Number(
              (
                await this.prisma.tour_schedules.findUnique({
                  where: { id: request.schedule_id },
                })
              )?.price || request.tours.price,
            )
          : Number(request.tours.price);
      const totalAmount = price * request.participant_count;

      if (request.status === 'paid' && totalPaid >= totalAmount) {
        throw new BadRequestException(
          'Yêu cầu đặt tour này đã được thanh toán đầy đủ 100%',
        );
      }

      // Tính số tiền cần thanh toán cho giao dịch này
      let amount = totalAmount - totalPaid;
      if (totalPaid === 0 && paymentType === 'deposit') {
        amount = Math.floor(totalAmount * 0.5);
      }

      // Kiểm tra xem đã có giao dịch pending cho yêu cầu này chưa
      const existingTransaction =
        await this.prisma.payment_transactions.findFirst({
          where: {
            tour_request_id: tourRequestId,
            user_id: userId,
            status: 'pending',
          },
        });

      let transactionId: string;

      if (existingTransaction) {
        transactionId = existingTransaction.id;
        // Cập nhật lại số tiền nếu người dùng thay đổi loại thanh toán (Full <-> Deposit)
        if (Number(existingTransaction.amount) !== amount) {
          await this.prisma.payment_transactions.update({
            where: { id: transactionId },
            data: { amount: amount },
          });
        }
      } else {
        transactionId = crypto.randomUUID();
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
      }

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

      let vnp_Params: Record<string, string | number> = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode || '';
      vnp_Params['vnp_Locale'] = 'vn';
      vnp_Params['vnp_CurrCode'] = 'VND';
      vnp_Params['vnp_TxnRef'] = transactionId;
      vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + transactionId;
      vnp_Params['vnp_OrderType'] = 'other';
      vnp_Params['vnp_Amount'] = amount * 100; // VNPAY yêu cầu nhân 100
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
    } catch (error) {
      console.error('Error creating payment:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Failed to create payment URL');
    }
  }

  // 2. IPN Listener (Dùng để VNPAY gọi về báo kết quả ngầm)
  async vnpayIpn(vnp_Params: Record<string, string | number>) {
    try {
      console.log('IPN Params:', vnp_Params);
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
        const transaction = await this.prisma.payment_transactions.findUnique({
          where: { id: orderId },
        });

        if (!transaction) {
          return { RspCode: '01', Message: 'Order not found' };
        }

        // Kiểm tra số tiền thanh toán có khớp không (VNPAY Amount nhân 100 lần)
        const vnpAmount = Number(vnp_Params['vnp_Amount']) / 100;
        if (vnpAmount !== Number(transaction.amount)) {
          return { RspCode: '04', Message: 'Invalid amount' };
        }

        if (transaction.status === 'paid' || transaction.status === 'failed') {
          return { RspCode: '02', Message: 'Order already confirmed' };
        }

        const isSuccess = rspCode === '00';
        const newStatus = isSuccess ? 'paid' : 'failed';

        // Kiểm tra tổng số tiền đã thanh toán sau khi giao dịch này thành công
        const paidTransactions =
          await this.prisma.payment_transactions.findMany({
            where: {
              tour_request_id: transaction.tour_request_id,
              status: 'paid',
            },
          });
        const currentPaidSum = paidTransactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0,
        );

        // Thêm số tiền của giao dịch hiện tại nếu nó thành công và chưa được lưu là 'paid' trong DB
        const transactionAmount = Number(transaction.amount);
        const totalPaid = isSuccess
          ? currentPaidSum + transactionAmount
          : currentPaidSum;

        // Lấy thông tin tour request để so sánh tổng tiền
        const tourRequest = await this.prisma.tour_requests.findUnique({
          where: { id: transaction.tour_request_id },
          include: { tours: true },
        });

        let targetStatus = 'approved'; // Giữ nguyên approved nếu chưa thanh toán đủ
        if (tourRequest) {
          const price = tourRequest.price_at_booking
            ? Number(tourRequest.price_at_booking)
            : tourRequest.schedule_id
              ? Number(
                  (
                    await this.prisma.tour_schedules.findUnique({
                      where: { id: tourRequest.schedule_id },
                    })
                  )?.price || tourRequest.tours.price,
                )
              : Number(tourRequest.tours.price);
          const totalAmount = price * tourRequest.participant_count;
          if (totalPaid >= totalAmount) {
            targetStatus = 'paid';
          } else if (totalPaid > 0) {
            targetStatus = 'partially_paid';
          }
        }

        let walletUpdates: any[] = [];
        if (isSuccess && transaction.user_id) {
          const userWallet = await this.prisma.user_wallets.findUnique({
            where: { user_id: transaction.user_id },
          });

          if (userWallet) {
            walletUpdates = [
              this.prisma.wallet_transactions.create({
                data: {
                  wallet_id: userWallet.id,
                  transaction_type: 'payment',
                  amount: -transactionAmount,
                  status: 'completed',
                  description: `Thanh toán qua VNPAY cho yêu cầu đặt tour: ${transaction.tour_request_id.split('-')[0]}`,
                },
              }),
              this.prisma.user_wallets.update({
                where: { id: userWallet.id },
                data: {
                  total_spent: { increment: transactionAmount },
                  updated_at: new Date(),
                },
              }),
            ];
          }
        }

        // Cập nhật Database (Dùng transaction của Prisma để đảm bảo đồng bộ)
        await this.prisma.$transaction([
          this.prisma.payment_transactions.update({
            where: { id: orderId },
            data: {
              status: newStatus,
              paid_at: isSuccess ? new Date() : undefined,
            },
          }),
          ...(isSuccess
            ? [
                this.prisma.tour_requests.update({
                  where: { id: transaction.tour_request_id },
                  data: { status: targetStatus },
                }),
                ...walletUpdates,
              ]
            : []),
        ]);

        // Nếu thanh toán thành công, gửi thông báo cho Guide
        if (isSuccess) {
          const requestWithGuide = await this.prisma.tour_requests.findUnique({
            where: { id: transaction.tour_request_id },
            include: {
              tours: { include: { guide_profiles: true } },
              users_tour_requests_user_idTousers: true,
            },
          });

          if (requestWithGuide) {
            const guideUserId = requestWithGuide.tours.guide_profiles.user_id;
            const customerName =
              requestWithGuide.users_tour_requests_user_idTousers.full_name;
            const tourTitle = requestWithGuide.tours.title;
            const amount = Number(transaction.amount);
            const totalPrice =
              Number(requestWithGuide.tours.price) *
              requestWithGuide.participant_count;

            let paymentDesc = `đã thanh toán ${amount.toLocaleString()} đ`;
            if (amount >= totalPrice) {
              paymentDesc = 'đã thanh toán 100%';
            } else if (amount >= totalPrice * 0.45) {
              paymentDesc = 'đã thanh toán 50% (Cọc)';
            }

            const title = 'Yêu cầu tham gia tour mới (Đã thanh toán)';
            const content = `Khách hàng ${customerName} đã đặt tour "${tourTitle}" và ${paymentDesc}. Vui lòng kiểm tra và xử lý.`;

            // 1. Lưu thông báo vào DB
            await this.notificationsService.create({
              user_id: guideUserId,
              title: title,
              content: content,
              type: 'tour_request',
              entity_type: 'TOUR_REQUEST',
              entity_id: transaction.tour_request_id,
            });

            // 2. Phát tín hiệu realtime qua Socket
            this.socketGateway.sendToUser(guideUserId, 'new_tour_request', {
              requestId: transaction.tour_request_id,
              tourTitle: tourTitle,
              message: content,
              paymentStatus: paymentDesc,
            });

            // 3. Generate PDF Invoice and Send Email to Customer via Background Job
            try {
              const customerEmail =
                requestWithGuide.users_tour_requests_user_idTousers.email;
              const customerNameFull =
                requestWithGuide.users_tour_requests_user_idTousers.full_name;
              const invoiceNumber = `INV-${transaction.transaction_code || transaction.id.substring(0, 8)}`;

              if (customerEmail) {
                await this.mailQueue.add('send-invoice', {
                  transactionId: transaction.id,
                  customerEmail,
                  customerNameFull: customerNameFull || 'Quý khách',
                  invoiceNumber,
                });
                console.log(
                  `[PaymentsService] Đã đưa job gửi hóa đơn vào Queue cho ${customerEmail}`,
                );
              }
            } catch (queueErr) {
              console.error('Error queuing PDF invoice job:', queueErr);
            }
          }
        }

        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        return { RspCode: '97', Message: 'Invalid Checksum' };
      }
    } catch (error) {
      console.error('IPN Error:', error);
      return {
        RspCode: '99',
        Message: error instanceof Error ? error.message : 'Unknown error',
        ReceivedParams: vnp_Params,
      };
    }
  }

  // 3. Lấy lịch sử giao dịch
  async getMyTransactions(userId: string) {
    return this.prisma.payment_transactions.findMany({
      where: { user_id: userId },
      include: {
        tour_requests: {
          include: { tours: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getPaymentById(userId: string, id: string) {
    const transaction = await this.prisma.payment_transactions.findUnique({
      where: { id },
      include: {
        tour_requests: {
          include: { tours: true },
        },
      },
    });

    if (!transaction || transaction.user_id !== userId) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    return transaction;
  }

  async cancelTransaction(userId: string, id: string) {
    const transaction = await this.prisma.payment_transactions.findUnique({
      where: { id },
    });

    if (!transaction || transaction.user_id !== userId) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    if (transaction.status !== 'pending') {
      throw new BadRequestException('Chỉ có thể hủy giao dịch đang chờ');
    }

    return this.prisma.payment_transactions.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  async generateInvoiceData(transactionId: string) {
    const transaction = await this.prisma.payment_transactions.findUnique({
      where: { id: transactionId },
      include: {
        users: true,
        tour_requests: {
          include: {
            tours: {
              include: {
                guide_profiles: {
                  include: { users: true },
                },
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Không tìm thấy giao dịch');
    }

    if (transaction.status !== 'paid') {
      throw new BadRequestException(
        'Chỉ có thể xuất hóa đơn cho giao dịch đã thanh toán',
      );
    }

    const tour = transaction.tour_requests?.tours;
    const customer = transaction.users;
    const guide = tour?.guide_profiles?.users;
    const amount = Number(transaction.amount);
    const vatRate = 0.1;
    const vatAmount = Math.round(amount * vatRate);
    const totalWithVat = amount + vatAmount;

    return {
      invoiceNumber: `INV-${transaction.transaction_code || transaction.id.substring(0, 8)}`,
      invoiceDate: transaction.paid_at || transaction.created_at,
      customer: {
        name: customer?.full_name || 'N/A',
        email: customer?.email || 'N/A',
        phone: customer?.phone || 'N/A',
      },
      tourInfo: {
        title: tour?.title || 'N/A',
        province: tour?.province || 'N/A',
        guideName: guide?.full_name || 'N/A',
      },
      transactionCode: transaction.transaction_code,
      paymentMethod: transaction.payment_method,
      subtotal: amount,
      vatRate: vatRate * 100,
      vatAmount,
      total: totalWithVat,
      currency: 'VND',
      companyInfo: {
        name: 'TravelConnect Vietnam',
        taxId: '0123456789',
        address: 'TP. Hồ Chí Minh, Việt Nam',
        email: 'contact@travelconnect.vn',
      },
    };
  }

  async getCashFlowForecast() {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Get upcoming tour bookings with paid status
    const upcomingPaidRequests = await this.prisma.tour_requests.findMany({
      where: {
        status: { in: ['paid', 'completed'] },
        tours: {
          deleted_at: null,
        },
      },
      include: {
        tours: true,
        tour_schedules: true,
        payment_transactions: {
          where: { status: 'paid' },
        },
      },
    });

    // Get pending refunds
    const pendingRefunds = await this.prisma.payment_transactions.findMany({
      where: {
        status: 'refund_pending',
      },
    });

    // Revenue from past 30 days (actual)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentPaidTransactions =
      await this.prisma.payment_transactions.findMany({
        where: {
          status: 'paid',
          paid_at: { gte: thirtyDaysAgo },
        },
      });

    // Group by day for the past 30 days
    const dailyRevenue: Record<string, number> = {};
    for (const tx of recentPaidTransactions) {
      const day = (tx.paid_at || tx.created_at).toISOString().split('T')[0];
      dailyRevenue[day] = (dailyRevenue[day] || 0) + Number(tx.amount);
    }

    // Calculate upcoming revenue from booked tours
    const upcomingRevenue: Record<string, number> = {};
    for (const req of upcomingPaidRequests) {
      const startDate = req.tour_schedules?.start_date || req.tours?.start_date;
      if (startDate) {
        const startDateObj = new Date(startDate);
        if (startDateObj >= now && startDateObj <= thirtyDaysLater) {
          const day = startDateObj.toISOString().split('T')[0];
          const totalPaid = req.payment_transactions.reduce(
            (sum, t) => sum + Number(t.amount),
            0,
          );
          upcomingRevenue[day] = (upcomingRevenue[day] || 0) + totalPaid;
        }
      }
    }

    // Calculate pending refund total
    const totalPendingRefunds = pendingRefunds.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    // Summary stats
    const totalRecentRevenue = Object.values(dailyRevenue).reduce(
      (a, b) => a + b,
      0,
    );
    const totalUpcomingRevenue = Object.values(upcomingRevenue).reduce(
      (a, b) => a + b,
      0,
    );

    return {
      period: {
        pastStart: thirtyDaysAgo.toISOString(),
        now: now.toISOString(),
        futureEnd: thirtyDaysLater.toISOString(),
      },
      summary: {
        totalRecentRevenue,
        totalUpcomingRevenue,
        totalPendingRefunds,
        netForecast: totalUpcomingRevenue - totalPendingRefunds,
      },
      dailyRevenue,
      upcomingRevenue,
      pendingRefundCount: pendingRefunds.length,
    };
  }

  async generatePdfInvoiceBuffer(transactionId: string): Promise<Buffer> {
    const data = await this.generateInvoiceData(transactionId);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Header
        doc.fontSize(20).text(data.companyInfo.name, { align: 'center' });
        doc.fontSize(10).text(data.companyInfo.address, { align: 'center' });
        doc.text(`Email: ${data.companyInfo.email}`, { align: 'center' });
        doc.moveDown();

        // Title
        doc
          .fontSize(16)
          .text('HOA DON THANH TOAN (VAT INVOICE)', { align: 'center' });
        doc.moveDown();

        // Invoice Info
        doc.fontSize(10).text(`So hoa don: ${data.invoiceNumber}`);
        doc.text(
          `Ngay: ${new Date(data.invoiceDate).toLocaleDateString('vi-VN')}`,
        );
        doc.text(`Ma giao dich: ${data.transactionCode || 'N/A'}`);
        doc.text(`Phuong thuc: ${data.paymentMethod}`);
        doc.moveDown();

        // Customer Info
        doc.fontSize(12).text('Thong tin khach hang:', { underline: true });
        doc.fontSize(10).text(`Ho ten: ${data.customer.name}`);
        doc.text(`Email: ${data.customer.email}`);
        doc.text(`So dien thoai: ${data.customer.phone}`);
        doc.moveDown();

        // Tour Info
        doc.fontSize(12).text('Thong tin Tour:', { underline: true });
        doc.fontSize(10).text(`Ten Tour: ${data.tourInfo.title}`);
        doc.text(`Dia diem: ${data.tourInfo.province}`);
        doc.text(`Huong dan vien: ${data.tourInfo.guideName}`);
        doc.moveDown();

        // Financial Details
        doc.fontSize(12).text('Chi tiet thanh toan:', { underline: true });
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(`Thanh tien: ${data.subtotal.toLocaleString('vi-VN')} VND`);
        doc.text(
          `Thue VAT (${data.vatRate}%): ${data.vatAmount.toLocaleString('vi-VN')} VND`,
        );
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`Tong cong: ${data.total.toLocaleString('vi-VN')} VND`);
        doc.font('Helvetica');

        // Footer
        doc.moveDown(3);
        doc
          .fontSize(10)
          .font('Helvetica-Oblique')
          .text('Cam on quy khach da su dung dich vu cua TravelConnect VN!', {
            align: 'center',
          });

        doc.end();
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }
}
