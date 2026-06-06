import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CashflowForecastingService {
  constructor(private prisma: PrismaService) {}

  async getForecast(days: number = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    // Lấy các tour đã đặt và chưa hoàn thành trong khoảng thời gian tới
    const upcomingTours = await this.prisma.tour_requests.findMany({
      where: {
        tours: {
          start_date: {
            lte: targetDate,
            gte: new Date(),
          },
        },
        status: { in: ['approved', 'payment_pending', 'paid'] }, // Các tour sắp đi
      },
      include: {
        tours: { select: { start_date: true } },
      },
    });

    // Gộp dữ liệu theo ngày
    const dailyForecast: Record<
      string,
      { expectedRevenue: number; platformFee: number; guidePayout: number }
    > = {};

    for (const req of upcomingTours) {
      if (!req.tours?.start_date || !req.price_at_booking) continue;

      const dateKey = req.tours.start_date.toISOString().split('T')[0];
      if (!dailyForecast[dateKey]) {
        dailyForecast[dateKey] = {
          expectedRevenue: 0,
          platformFee: 0,
          guidePayout: 0,
        };
      }

      const price = Number(req.price_at_booking) * req.participant_count;
      // Giả sử phí nền tảng là 10%
      const fee = price * 0.1;
      const payout = price - fee;

      dailyForecast[dateKey].expectedRevenue += price;
      dailyForecast[dateKey].platformFee += fee;
      dailyForecast[dateKey].guidePayout += payout;
    }

    const series = Object.keys(dailyForecast)
      .sort()
      .map((date) => ({
        date,
        ...dailyForecast[date],
      }));

    return {
      days,
      totalExpectedRevenue: series.reduce(
        (sum, item) => sum + item.expectedRevenue,
        0,
      ),
      totalPlatformFee: series.reduce((sum, item) => sum + item.platformFee, 0),
      totalGuidePayout: series.reduce((sum, item) => sum + item.guidePayout, 0),
      series,
    };
  }
}
