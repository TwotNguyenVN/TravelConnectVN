import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<nodemailer.SentMessageInfo>;

  constructor() {
    // Setup SMTP transporter. Fallback to ethereal for testing if no env provided.
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.ethereal.email',
      port: Number(process.env.MAIL_PORT) || 587,
      auth: {
        user: process.env.MAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.MAIL_PASS || 'ethereal_password',
      },
    });
  }

  async sendInvoiceEmail(
    to: string,
    customerName: string,
    invoicePdfBuffer: Buffer,
    invoiceNumber: string,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from: `"TravelConnect VN" <${process.env.MAIL_FROM || 'noreply@travelconnect.vn'}>`,
        to: to,
        subject: `Hóa đơn thanh toán - ${invoiceNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #2563eb;">TravelConnect VN</h2>
            <p>Kính gửi <strong>${customerName}</strong>,</p>
            <p>Cảm ơn bạn đã đặt tour và sử dụng dịch vụ của TravelConnect VN. Giao dịch thanh toán của bạn đã được xác nhận thành công.</p>
            <p>Chúng tôi xin gửi đính kèm Hóa đơn VAT (PDF) cho giao dịch <strong>${invoiceNumber}</strong> trong email này.</p>
            <br/>
            <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng qua email contact@travelconnect.vn.</p>
            <p>Trân trọng,<br/>Đội ngũ TravelConnect VN</p>
          </div>
        `,
        attachments: [
          {
            filename: `${invoiceNumber}.pdf`,
            content: invoicePdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      this.logger.log(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Invoice email sent to ${to} [Message ID: ${info.messageId}]`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (info.messageId && info.messageId.includes('ethereal')) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return true;
    } catch (error) {
      this.logger.error(`Failed to send invoice email to ${to}:`, error);
      return false;
    }
  }
}
