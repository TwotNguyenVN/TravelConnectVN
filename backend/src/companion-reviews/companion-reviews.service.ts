import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanionReviewDto } from './dto/create-companion-review.dto';
import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

@Injectable()
export class CompanionReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: UserActivityLogsService,
  ) {}

  async create(userId: string, dto: CreateCompanionReviewDto) {
    // 1. Tìm yêu cầu tham gia companion trip
    const request = await this.prisma.companion_requests.findUnique({
      where: { id: dto.requestId },
      include: {
        companion_posts: {
          select: {
            title: true,
            user_id: true,
            end_date: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Yêu cầu tham gia chuyến đi đồng hành không tồn tại');
    }

    // 2. Kiểm tra quyền sở hữu (người đánh giá phải là người gửi request)
    if (request.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền đánh giá yêu cầu này');
    }

    // 3. Kiểm tra trạng thái và thời gian kết thúc chuyến đi
    // Request phải ở trạng thái 'approved' và thời gian hiện tại đã qua end_date của bài đăng
    if (request.status !== 'approved') {
      throw new BadRequestException('Chỉ có thể đánh giá chuyến đi đồng hành đã được chấp nhận');
    }

    const today = new Date();
    const endDate = new Date(request.companion_posts.end_date);
    if (today < endDate) {
      throw new BadRequestException('Chỉ có thể đánh giá sau khi chuyến đi đã kết thúc');
    }

    // 4. Kiểm tra xem đã đánh giá chưa (đảm bảo request_id là unique trong companion_reviews)
    const existing = await this.prisma.companion_reviews.findUnique({
      where: { request_id: dto.requestId },
    });

    if (existing) {
      throw new ConflictException('Bạn đã đánh giá chuyến đi đồng hành này rồi');
    }

    // 5. Lưu đánh giá vào database
    const review = await this.prisma.companion_reviews.create({
      data: {
        post_id: dto.postId,
        request_id: dto.requestId,
        user_id: userId,
        host_id: request.companion_posts.user_id,
        rating: dto.rating,
        comment: dto.comment,
        visibility_status: 'visible',
      },
    });

    // 6. Ghi log hoạt động người dùng
    await this.activityLogsService.log(
      userId,
      'review.companion_created',
      'COMPANION_REVIEW',
      review.id,
      { post_title: request.companion_posts.title, rating: dto.rating },
    );

    return review;
  }

  async getHostReviews(hostId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.companion_reviews.findMany({
        where: {
          host_id: hostId,
          visibility_status: 'visible',
        },
        include: {
          users_reviewer: {
            select: {
              full_name: true,
              avatar_url: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.companion_reviews.count({
        where: {
          host_id: hostId,
          visibility_status: 'visible',
        },
      }),
    ]);

    return {
      data: reviews.map((r) => ({
        id: r.id,
        user: r.users_reviewer?.full_name || 'Người dùng ẩn danh',
        avatar: r.users_reviewer?.avatar_url || '',
        rating: r.rating,
        comment: r.comment,
        date: r.created_at,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostReviews(postId: string) {
    const reviews = await this.prisma.companion_reviews.findMany({
      where: {
        post_id: postId,
        visibility_status: 'visible',
      },
      include: {
        users_reviewer: {
          select: {
            full_name: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      user: r.users_reviewer?.full_name || 'Người dùng ẩn danh',
      avatar: r.users_reviewer?.avatar_url || '',
      rating: r.rating,
      comment: r.comment,
      date: r.created_at,
    }));
  }
}
