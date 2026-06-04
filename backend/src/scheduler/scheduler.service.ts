import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Chạy mỗi 1 giờ
  @Cron(CronExpression.EVERY_HOUR)
  async handleCronJobs() {
    this.logger.log('--- Bắt đầu chạy Scheduler Job định kỳ ---');
    try {
      await this.cancelExpiredUnpaidBookings();
      await this.completeEndedTours();
      await this.completeEndedCompanions();
    } catch (error) {
      this.logger.error('Lỗi khi chạy Scheduler Job:', error);
    }
    this.logger.log('--- Kết thúc chạy Scheduler Job ---');
  }

  /**
   * 1. Hủy đơn Tour chưa thanh toán sát giờ hoặc quá hạn khởi hành
   * (Trước giờ khởi hành 24 tiếng nếu chưa trả đồng nào)
   */
  async cancelExpiredUnpaidBookings() {
    this.logger.log('Đang quét các đơn đặt Tour chưa thanh toán quá hạn...');
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Tìm các tour_requests ở trạng thái pending (Chờ thanh toán)
    const pendingRequests = await this.prisma.tour_requests.findMany({
      where: {
        status: 'pending',
      },
      include: {
        tours: true,
        tour_schedules: true,
        payment_transactions: true,
      },
    });

    let cancelledCount = 0;

    for (const req of pendingRequests) {
      const startDateVal =
        req.tour_schedules?.start_date || req.tours.start_date;
      if (!startDateVal) continue;

      const scheduleStartDate = new Date(startDateVal);

      // Nếu lịch trình bắt đầu trong vòng 24 giờ tới hoặc đã qua ngày đi
      if (scheduleStartDate <= oneDayFromNow) {
        // Tính tổng tiền đã trả thực tế qua giao dịch thành công (paid)
        const totalPaid = req.payment_transactions
          .filter((tx) => tx.status === 'paid')
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        if (totalPaid === 0) {
          // Thực hiện hủy đơn
          await this.prisma.tour_requests.update({
            where: { id: req.id },
            data: {
              status: 'cancelled_by_user',
              cancellation_note:
                'Hệ thống tự động hủy do quá hạn thanh toán (chưa thanh toán trước khi khởi hành 24 giờ).',
              cancelled_at: now,
            },
          });
          cancelledCount++;
          this.logger.log(
            `Đã hủy tự động Đơn đặt Tour ID: ${req.id} (Tour khởi hành ngày ${scheduleStartDate.toLocaleDateString()})`,
          );
        }
      }
    }

    this.logger.log(
      `Hoàn thành hủy đơn đặt tour quá hạn. Số lượng hủy: ${cancelledCount}`,
    );
  }

  /**
   * 2. Hoàn thành các Tour đã kết thúc lịch trình
   */
  async completeEndedTours() {
    this.logger.log('Đang quét các Tour & Lịch trình đã kết thúc...');
    const now = new Date();

    // A. Cập nhật các Lịch trình Tour (tour_schedules) đã qua ngày khởi hành thành 'completed'
    // Lưu ý: Ta tính ngày kết thúc = start_date + duration (nếu có, mặc định là 1 ngày nếu không có num_days)
    const activeSchedules = await this.prisma.tour_schedules.findMany({
      where: {
        status: 'available',
        start_date: { lt: now },
      },
      include: {
        tours: true,
      },
    });

    let completedSchedulesCount = 0;

    for (const schedule of activeSchedules) {
      const numDays = schedule.tours.num_days || 1;
      const endDate = new Date(
        new Date(schedule.start_date).getTime() + numDays * 24 * 60 * 60 * 1000,
      );

      if (now >= endDate) {
        await this.prisma.tour_schedules.update({
          where: { id: schedule.id },
          data: { status: 'completed' },
        });
        completedSchedulesCount++;
        this.logger.log(
          `Lịch trình ID: ${schedule.id} của Tour "${schedule.tours.title}" đã được chuyển sang completed.`,
        );
      }
    }

    // B. Chuyển trạng thái các tour_requests (đã được duyệt/thanh toán) liên quan sang 'completed' để mở chức năng Review
    const paidRequests = await this.prisma.tour_requests.findMany({
      where: {
        status: { in: ['approved', 'paid', 'payment_pending'] },
      },
      include: {
        tours: true,
        tour_schedules: {
          include: {
            tours: true,
          },
        },
      },
    });

    let completedRequestsCount = 0;

    for (const req of paidRequests) {
      const startDateVal =
        req.tour_schedules?.start_date || req.tours.start_date;
      if (!startDateVal) continue;

      const numDays =
        req.tour_schedules?.tours.num_days || req.tours.num_days || 1;
      const endDate = new Date(
        new Date(startDateVal).getTime() + numDays * 24 * 60 * 60 * 1000,
      );

      if (now >= endDate) {
        await this.prisma.tour_requests.update({
          where: { id: req.id },
          data: { status: 'completed' },
        });
        completedRequestsCount++;
        this.logger.log(
          `Yêu cầu đặt tour ID: ${req.id} đã tự động chuyển sang completed do tour đã kết thúc.`,
        );
      }
    }

    this.logger.log(
      `Hoàn thành cập nhật trạng thái kết thúc Tour. Lịch trình: ${completedSchedulesCount}, Yêu cầu: ${completedRequestsCount}`,
    );
  }

  /**
   * 3. Đóng và hoàn thành các bài viết Bạn đồng hành & Yêu cầu đồng hành liên quan
   */
  async completeEndedCompanions() {
    this.logger.log('Đang quét các bài tuyển Bạn đồng hành đã kết thúc...');
    const now = new Date();

    // A. Chuyển trạng thái các companion_posts đã qua end_date thành 'closed'
    const openPosts = await this.prisma.companion_posts.findMany({
      where: {
        business_status: 'open',
        end_date: { lt: now },
      },
    });

    let closedPostsCount = 0;
    if (openPosts.length > 0) {
      const openPostIds = openPosts.map((p) => p.id);

      // A1. Cập nhật tất cả các bài thành 'closed'
      await this.prisma.companion_posts.updateMany({
        where: { id: { in: openPostIds } },
        data: { business_status: 'closed' },
      });

      // B. Tự động từ chối (reject) tất cả các yêu cầu gia nhập đoàn vẫn đang ở trạng thái pending của các bài này
      await this.prisma.companion_requests.updateMany({
        where: {
          post_id: { in: openPostIds },
          status: 'pending',
        },
        data: {
          status: 'rejected',
          response_note:
            'Yêu cầu bị từ chối tự động vì thời hạn đăng ký bài viết đồng hành đã kết thúc.',
          processed_at: now,
        },
      });

      closedPostsCount = openPosts.length;
      this.logger.log(
        `Đã đóng ${closedPostsCount} bài viết Bạn đồng hành và từ chối các yêu cầu chờ duyệt.`,
      );
    }

    this.logger.log(
      `Hoàn thành cập nhật Bạn đồng hành. Bài viết đóng: ${closedPostsCount}`,
    );
  }
}
