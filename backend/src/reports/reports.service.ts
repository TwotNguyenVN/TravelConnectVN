import { Injectable } from '@nestjs/common';
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
}
