import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async log(userId: string, activityType: string, entityType?: string, entityId?: string, metadata: any = {}) {
    return this.prisma.user_activity_logs.create({
      data: {
        user_id: userId,
        activity_type: activityType,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata,
      },
    });
  }

  async findAll(userId: string, page: number = 1, limit: number = 20, activityType?: string) {
    const skip = (page - 1) * limit;
    const where: any = { user_id: userId };
    if (activityType && activityType !== 'all') {
      // Support prefix matching e.g. 'auth' matches 'auth.registered', 'auth.logged_in'
      where.activity_type = { startsWith: activityType };
    }
    const [logs, total] = await Promise.all([
      this.prisma.user_activity_logs.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.user_activity_logs.count({ where }),
    ]);

    const mappedLogs = logs.map(log => ({
      ...log,
      action_type: log.activity_type,
      description: this.generateDescription(log),
    }));

    return {
      data: mappedLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private generateDescription(log: any): string {
    const { activity_type, metadata } = log;
    const m = metadata as any;

    switch (activity_type) {
      case 'auth.registered': return 'Bạn đã đăng ký tài khoản thành công.';
      case 'auth.logged_in': return 'Bạn đã đăng nhập vào hệ thống.';
      case 'profile.updated': return 'Bạn đã cập nhật thông tin cá nhân.';
      case 'profile.avatar_updated': return 'Bạn đã thay đổi ảnh đại diện.';
      case 'tour_request.created': return `Bạn đã gửi yêu cầu tham gia tour "${m.tour_title || 'một tour'}".`;
      case 'tour_request.cancelled': return `Bạn đã hủy yêu cầu tham gia tour "${m.tour_title || 'một tour'}".`;
      case 'tour_request.processed': 
        return `Yêu cầu tour "${m.tour_title || 'một tour'}" đã được ${m.status === 'approved' ? 'chấp nhận' : 'từ chối'}.`;
      case 'companion_post.created': return `Bạn đã đăng bài tìm bạn đồng hành "${m.title || 'mới'}".`;
      case 'companion_post.updated': return `Bạn đã cập nhật bài đồng hành "${m.title || 'hiện tại'}".`;
      case 'companion_request.created': return `Bạn đã gửi yêu cầu đồng hành cho bài "${m.post_title || 'một bài đăng'}".`;
      case 'favorite.tour_added': return `Bạn đã thêm tour "${m.title || 'một tour'}" vào danh sách yêu thích.`;
      case 'favorite.guide_added': return `Bạn đã thêm hướng dẫn viên "${m.name || 'một người'}" vào danh sách yêu thích.`;
      case 'review.tour_created': return `Bạn đã gửi đánh giá cho tour "${m.tour_title || 'một tour'}".`;
      case 'review.guide_created': return `Bạn đã gửi đánh giá cho hướng dẫn viên của tour "${m.tour_title || 'một tour'}".`;
      case 'report.created': return `Bạn đã gửi báo cáo vi phạm đối với ${m.target_type === 'TOUR' ? 'tour' : 'người dùng'}.`;
      case 'guide.verification_submitted': return 'Bạn đã gửi yêu cầu xác minh hướng dẫn viên.';
      default: return `Hoạt động: ${activity_type}`;
    }
  }

}
