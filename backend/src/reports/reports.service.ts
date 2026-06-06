import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: UserActivityLogsService,
  ) {}

  async create(reporterId: string, dto: CreateReportDto) {
    const report = await this.prisma.reports.create({
      data: {
        reporter_user_id: reporterId,
        target_type: dto.target_type,
        tour_id: dto.tour_id,
        companion_post_id: dto.companion_post_id,
        reported_user_id: dto.reported_user_id,
        guide_profile_id: dto.guide_profile_id,
        reason: dto.reason,
        description: dto.description,
        status: 'open',
      },
    });

    // Ghi log hoạt động
    await this.activityLogsService.log(
      reporterId,
      'report.created',
      'REPORT',
      report.id,
      { target_type: dto.target_type, reason: dto.reason },
    );

    return report;
  }

  async getMyReports(userId: string) {
    return this.prisma.reports.findMany({
      where: { reporter_user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getAllReports(status?: string) {
    return this.prisma.reports.findMany({
      where: status ? { status } : undefined,
      include: {
        users_reports_reporter_user_idTousers: { select: { full_name: true, email: true } },
        users_reports_reported_user_idTousers: { select: { full_name: true } },
        tours: { select: { title: true } },
        companion_posts: { select: { title: true } },
        guide_profiles: { include: { users: { select: { full_name: true } } } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async resolveReport(
    reportId: string,
    moderatorId: string,
    action: 'dismiss' | 'hide' | 'warn',
    resolutionNote: string,
  ) {
    const report = await this.prisma.reports.findUnique({
      where: { id: reportId },
    });
    if (!report) throw new NotFoundException('Report không tồn tại');

    // Cập nhật trạng thái báo cáo
    const updatedReport = await this.prisma.reports.update({
      where: { id: reportId },
      data: {
        status: action === 'dismiss' ? 'dismissed' : 'resolved',
        processed_by_user_id: moderatorId,
        processed_at: new Date(),
        resolution_note: resolutionNote,
      },
    });

    // Lưu vào bảng lịch sử
    await this.prisma.report_processing_history.create({
      data: {
        report_id: reportId,
        action_by_user_id: moderatorId,
        action_type: action,
        old_status: report.status,
        new_status: action === 'dismiss' ? 'dismissed' : 'resolved',
        note: resolutionNote,
      },
    });

    // Nếu hành động là 'hide' hoặc 'warn', tiến hành trừ uy tín và ẩn bài
    if (action === 'hide' || action === 'warn') {
      if (report.tour_id) {
        await this.prisma.tours.update({
          where: { id: report.tour_id },
          data: { visibility_status: 'hidden' },
        });
      } else if (report.companion_post_id) {
        await this.prisma.companion_posts.update({
          where: { id: report.companion_post_id },
          data: { visibility_status: 'hidden' },
        });
      }

      // Trừ uy tín HDV nếu vi phạm thuộc về HDV
      if (report.guide_profile_id) {
        const guide = await this.prisma.guide_profiles.findUnique({
          where: { id: report.guide_profile_id },
        });
        if (guide) {
          const newRep = Math.max(0, guide.reputation_score - 10);
          await this.prisma.guide_profiles.update({
            where: { id: report.guide_profile_id },
            data: { reputation_score: newRep },
          });
        }
      } else if (report.reported_user_id) {
        // Cảnh báo User (ví dụ cập nhật trạng thái warning)
      }
    }

    return updatedReport;
  }

  async getReportHeatmap() {
    // Thống kê đơn giản theo ngày cho 30 ngày gần nhất
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reports = await this.prisma.reports.findMany({
      where: { created_at: { gte: thirtyDaysAgo } },
      select: { created_at: true, target_type: true },
    });

    // Group by date
    const heatmap: Record<string, number> = {};
    reports.forEach((r) => {
      const dateStr = r.created_at.toISOString().split('T')[0];
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    });

    return Object.entries(heatmap).map(([date, count]) => ({
      date,
      count,
    }));
  }
}
