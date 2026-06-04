import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceCronService {
  private readonly logger = new Logger(FinanceCronService.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Chạy quyết toán tự động:
   * Mặc định là 2h sáng mùng 1 hàng tháng: @Cron('0 2 1 * *')
   * Để test nhanh: @Cron(CronExpression.EVERY_5_MINUTES)
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleAutoSettlement() {
    this.logger.log(
      '--- Bắt đầu chạy Quyết toán HDV tự động (Auto-Settlement) ---',
    );
    try {
      const settlements = await this.adminService.getGuideSettlements();

      let settledCount = 0;
      for (const st of settlements) {
        // Chỉ quyết toán khi thu nhập ròng > 500.000 VNĐ
        if (st.netPayable > 500000) {
          this.logger.log(
            `Tiến hành quyết toán tự động cho HDV ${st.fullName} (ID: ${st.guideProfileId}) - Số tiền: ${st.netPayable} VND`,
          );

          // Thực hiện quyết toán với adminId = 'system-cron'
          await this.adminService.settleGuideTransactions(
            st.guideProfileId,
            'system-cron',
          );
          settledCount++;
        }
      }
      this.logger.log(
        `Hoàn thành quyết toán tự động. Số HDV được quyết toán: ${settledCount}`,
      );
    } catch (error) {
      this.logger.error('Lỗi khi chạy Quyết toán tự động:', error);
    }
    this.logger.log('--- Kết thúc Quyết toán HDV tự động ---');
  }
}
