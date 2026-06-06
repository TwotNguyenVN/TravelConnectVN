import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class InvoiceService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async generateInvoice(paymentTransactionId: string) {
    const tx = await this.prisma.payment_transactions.findUnique({
      where: { id: paymentTransactionId },
      include: { users: true },
    });

    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }

    // Kiểm tra xem đã có hóa đơn chưa
    const existingInvoice = await this.prisma.invoices.findUnique({
      where: { payment_transaction_id: paymentTransactionId },
    });

    if (existingInvoice) {
      return existingInvoice;
    }

    // Mock gọi API VNPT / MISA sinh hóa đơn
    const mockInvoiceNumber =
      'INV-' + randomBytes(4).toString('hex').toUpperCase();
    const mockPdfUrl = `https://travelconnect.vn/invoices/${mockInvoiceNumber}.pdf`;

    const newInvoice = await this.prisma.invoices.create({
      data: {
        payment_transaction_id: paymentTransactionId,
        invoice_number: mockInvoiceNumber,
        total_amount: tx.amount,
        pdf_url: mockPdfUrl,
        status: 'issued',
      },
    });

    // Gửi email
    if (tx.users?.email) {
      // Mock gửi email (MailService giả định có sendInvoiceEmail hoặc dùng log)
      console.log(
        `[InvoiceService] Đã gửi hóa đơn điện tử ${mockInvoiceNumber} đến ${tx.users.email}`,
      );
    }

    return newInvoice;
  }
}
