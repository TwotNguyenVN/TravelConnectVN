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
        start_date: {
          lte: targetDate,
          gte: new Date(),
        },
        status: { in: ['approved', 'payment_pending'] } // Các tour sắp đi
      },
      select: {
        start_date: true,
        agreed_price: true,
      }
    });

    // Gộp dữ liệu theo ngày
    const dailyForecast: Record<string, { expectedRevenue: number, platformFee: number, guidePayout: number }> = {};

    for (const tour of upcomingTours) {
      if (!tour.start_date || !tour.agreed_price) continue;
      
      const dateKey = tour.start_date.toISOString().split('T')[0];
      if (!dailyForecast[dateKey]) {
        dailyForecast[dateKey] = { expectedRevenue: 0, platformFee: 0, guidePayout: 0 };
      }

      const price = Number(tour.agreed_price);
      // Giả sử phí nền tảng là 10%
      const fee = price * 0.1;
      const payout = price - fee;

      dailyForecast[dateKey].expectedRevenue += price;
      dailyForecast[dateKey].platformFee += fee;
      dailyForecast[dateKey].guidePayout += payout;
    }

    const series = Object.keys(dailyForecast).sort().map(date => ({
      date,
      ...dailyForecast[date]
    }));

    return {
      days,
      totalExpectedRevenue: series.reduce((sum, item) => sum + item.expectedRevenue, 0),
      totalPlatformFee: series.reduce((sum, item) => sum + item.platformFee, 0),
      totalGuidePayout: series.reduce((sum, item) => sum + item.guidePayout, 0),
      series
    };
  }
}
