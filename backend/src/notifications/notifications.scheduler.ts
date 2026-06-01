import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsScheduler implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  onModuleInit() {
    // Run the check immediately on startup in background
    setTimeout(() => {
      this.checkAndSendReminders();
    }, 5000);
    
    // Check every 5 minutes
    setInterval(() => {
      this.checkAndSendReminders();
    }, 5 * 60 * 1000); 
  }

  async checkAndSendReminders() {
    const now = new Date();
    const hour = now.getHours();
    
    // Only run during 9 AM (9:00 - 9:59) or 9 PM (21:00 - 21:59)
    if (hour !== 9 && hour !== 21) {
      return;
    }

    try {
      // Find all active tour requests
      const requests = await this.prisma.tour_requests.findMany({
        where: {
          status: { in: ['approved', 'payment_pending', 'paid'] }
        },
        include: {
          tours: true,
          tour_schedules: true,
          payment_transactions: {
            where: { status: 'paid' }
          }
        }
      });

      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

      for (const req of requests) {
        const schedule = req.tour_schedules;
        if (!schedule) continue;
        
        const startDate = new Date(schedule.start_date);
        const diffMs = startDate.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        
        const totalPaid = req.payment_transactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalPrice = Number(schedule.price) * req.participant_count;
        
        // Case 1: Paid only 50% (deposit) and starts within 3 days
        if (totalPaid > 0 && totalPaid < totalPrice && diffDays <= 3 && diffDays > 0) {
          const existing = await this.prisma.notifications.findFirst({
            where: {
              entity_id: req.id,
              notification_type: 'payment_reminder_3d',
              created_at: { gte: twelveHoursAgo }
            }
          });
          
          if (!existing) {
            const remainingAmount = totalPrice - totalPaid;
            await this.notificationsService.create({
              user_id: req.user_id,
              title: 'Nhắc nhở: Thanh toán số tiền còn lại của Tour',
              content: `Tour "${req.tours.title}" của bạn sẽ bắt đầu trong 3 ngày tới. Vui lòng hoàn tất thanh toán phần tiền còn lại (${remainingAmount.toLocaleString()} đ) trước khi tour bắt đầu. Nếu không, bạn sẽ không có tên trong danh sách chuyến đi và chỉ được hoàn lại 50% tiền cọc.`,
              type: 'payment_reminder_3d',
              entity_type: 'TOUR_REQUEST',
              entity_id: req.id
            });
          }
        }
        
        // Case 2: Paid 100% and starts within 1 day
        if (totalPaid >= totalPrice && diffDays <= 1 && diffDays > 0) {
          const existing = await this.prisma.notifications.findFirst({
            where: {
              entity_id: req.id,
              notification_type: 'tour_reminder_1d',
              created_at: { gte: twelveHoursAgo }
            }
          });
          
          if (!existing) {
            const formattedTime = req.tours.meet_time ? `lúc ${req.tours.meet_time}` : '';
            const formattedPoint = req.tours.meet_point ? `tại ${req.tours.meet_point}` : '';
            await this.notificationsService.create({
              user_id: req.user_id,
              title: 'Nhắc nhở: Chuyến đi sắp tới của bạn',
              content: `Bạn có chuyến đi "${req.tours.title}" khởi hành vào ngày ${new Date(schedule.start_date).toLocaleDateString('vi-VN')} ${formattedTime} ${formattedPoint}. Hãy chuẩn bị hành lý sẵn sàng cho chuyến đi nhé!`,
              type: 'tour_reminder_1d',
              entity_type: 'TOUR_REQUEST',
              entity_id: req.id
            });
          }
        }
      }
    } catch (error) {
      console.error('Error running reminders scheduler:', error);
    }
  }
}
