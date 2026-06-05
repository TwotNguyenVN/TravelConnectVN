import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { Inject, forwardRef } from '@nestjs/common';

interface InvoiceData {
  transactionId: string;
  customerEmail: string;
  customerNameFull: string;
  invoiceNumber: string;
}

@Processor('mailQueue')
export class MailProcessor extends WorkerHost {
  constructor(
    private readonly mailService: MailService,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<unknown, unknown, string>): Promise<unknown> {
    console.log(`[MailProcessor] Xử lý job ${job.id} - ${job.name}`);

    switch (job.name) {
      case 'send-invoice':
        await this.handleSendInvoice(job.data as InvoiceData);
        break;
      // Add more mail tasks here (e.g. 'send-welcome-email')
      default:
        console.warn(`[MailProcessor] Unknown job name: ${job.name}`);
    }
  }

  private async handleSendInvoice(data: InvoiceData) {
    const { transactionId, customerEmail, customerNameFull, invoiceNumber } =
      data;
    try {
      // Gọi PaymentsService để sinh PDF Buffer
      const pdfBuffer =
        await this.paymentsService.generatePdfInvoiceBuffer(transactionId);

      // Gọi MailService gửi đi
      await this.mailService.sendInvoiceEmail(
        customerEmail,
        customerNameFull,
        pdfBuffer,
        invoiceNumber,
      );
      console.log(
        `[MailProcessor] Đã gửi hóa đơn PDF thành công cho giao dịch ${transactionId}`,
      );
    } catch (err) {
      console.error(
        `[MailProcessor] Lỗi khi xử lý send-invoice cho ${transactionId}:`,
        err,
      );
      throw err; // Ném lỗi để BullMQ retry nếu cần
    }
  }
}
