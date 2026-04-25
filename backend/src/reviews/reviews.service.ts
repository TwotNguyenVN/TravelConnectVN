import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourReviewDto, CreateGuideReviewDto } from './dto/create-review.dto';

import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: UserActivityLogsService,
  ) {}


  // ==========================================
  // TOUR REVIEWS
  // ==========================================

  async createTourReview(userId: string, dto: CreateTourReviewDto) {
    // 1. Find tour request
    const tourRequest = await this.prisma.tour_requests.findUnique({
      where: { id: dto.tourRequestId },
      include: { tours: true }
    });

    if (!tourRequest) {
      throw new NotFoundException('Yêu cầu đặt tour không tồn tại');
    }

    // 2. Ownership check
    if (tourRequest.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền đánh giá yêu cầu này');
    }

    // 3. Status check
    const validStatuses = ['approved', 'paid'];
    if (!validStatuses.includes(tourRequest.status)) {
      throw new BadRequestException('Chỉ có thể đánh giá những tour đã được chấp nhận hoặc đã thanh toán');
    }

    // 4. Already reviewed check
    const existing = await this.prisma.tour_reviews.findUnique({
      where: { tour_request_id: dto.tourRequestId }
    });

    if (existing) {
      throw new ConflictException('Bạn đã đánh giá tour này rồi');
    }

    // 5. Create review
    const review = await this.prisma.tour_reviews.create({
      data: {
        tour_id: tourRequest.tour_id,
        user_id: userId,
        tour_request_id: dto.tourRequestId,
        rating: dto.rating,
        comment: dto.comment,
        visibility_status: 'visible'
      }
    });

    // 6. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'review.tour_created',
      'TOUR_REVIEW',
      review.id,
      { tour_title: tourRequest.tours.title, rating: dto.rating },
    );

    return review;

  }

  async getTourReviews(tourId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.tour_reviews.findMany({
        where: {
          tour_id: tourId,
          visibility_status: 'visible'
        },
        include: {
          users: {
            select: {
              full_name: true,
              avatar_url: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.tour_reviews.count({
        where: {
          tour_id: tourId,
          visibility_status: 'visible'
        }
      })
    ]);

    return {
      data: reviews.map(r => ({
        id: r.id,
        user: r.users?.full_name || 'Người dùng ẩn danh',
        avatar: r.users?.avatar_url || '',
        rating: r.rating,
        comment: r.comment,
        date: r.created_at
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // ==========================================
  // GUIDE REVIEWS
  // ==========================================

  async createGuideReview(userId: string, dto: CreateGuideReviewDto) {
    // 1. Find tour request
    const tourRequest = await this.prisma.tour_requests.findUnique({
      where: { id: dto.tourRequestId },
      include: { 
        tours: {
          select: { title: true, guide_profile_id: true }
        }
      }
    });

    if (!tourRequest) {
      throw new NotFoundException('Yêu cầu đặt tour không tồn tại');
    }

    // 2. Ownership check
    if (tourRequest.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền đánh giá yêu cầu này');
    }

    // 3. Status check
    const validStatuses = ['approved', 'paid'];
    if (!validStatuses.includes(tourRequest.status)) {
      throw new BadRequestException('Chỉ có thể đánh giá hướng dẫn viên sau khi tour được chấp nhận hoặc đã thanh toán');
    }

    // 4. Already reviewed check
    const existing = await this.prisma.guide_reviews.findUnique({
      where: { tour_request_id: dto.tourRequestId }
    });

    if (existing) {
      throw new ConflictException('Bạn đã đánh giá hướng dẫn viên này cho tour này rồi');
    }

    // 5. Create review
    const review = await this.prisma.guide_reviews.create({
      data: {
        guide_profile_id: tourRequest.tours.guide_profile_id,
        tour_id: tourRequest.tour_id,
        user_id: userId,
        tour_request_id: dto.tourRequestId,
        rating: dto.rating,
        comment: dto.comment,
        visibility_status: 'visible'
      }
    });

    // 6. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'review.guide_created',
      'GUIDE_REVIEW',
      review.id,
      { tour_title: tourRequest.tours.title, rating: dto.rating },
    );

    return review;

  }

  async getGuideReviews(guideId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.guide_reviews.findMany({
        where: {
          guide_profile_id: guideId,
          visibility_status: 'visible'
        },
        include: {
          users: {
            select: {
              full_name: true,
              avatar_url: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.guide_reviews.count({
        where: {
          guide_profile_id: guideId,
          visibility_status: 'visible'
        }
      })
    ]);

    return {
      data: reviews.map(r => ({
        id: r.id,
        user: r.users?.full_name || 'Người dùng ẩn danh',
        avatar: r.users?.avatar_url || '',
        rating: r.rating,
        comment: r.comment,
        date: r.created_at
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // ==========================================
  // USER REVIEWS (FOR DASHBOARD)
  // ==========================================

  async getMyReviews(userId: string) {
    const [tourReviews, guideReviews] = await Promise.all([
      this.prisma.tour_reviews.findMany({
        where: { user_id: userId },
        include: { tours: { select: { title: true } } },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.guide_reviews.findMany({
        where: { user_id: userId },
        include: { 
          guide_profiles: { 
            include: { users: { select: { full_name: true } } } 
          },
          tours: { select: { title: true } }
        },
        orderBy: { created_at: 'desc' }
      })
    ]);

    return {
      tours: tourReviews.map(r => ({
        id: r.id,
        tourId: r.tour_id,
        tourTitle: r.tours.title,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at
      })),
      guides: guideReviews.map(r => ({
        id: r.id,
        guideId: r.guide_profile_id,
        guideName: r.guide_profiles.users?.full_name || 'Hướng dẫn viên',
        tourTitle: r.tours.title,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at
      }))
    };
  }

  // ==========================================
  // ADMIN MANAGEMENT
  // ==========================================

  async getAllReviewsAdmin(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [tourReviews, guideReviews, totalTour, totalGuide] = await Promise.all([
      this.prisma.tour_reviews.findMany({
        include: { 
          users: { select: { full_name: true, avatar_url: true } },
          tours: { select: { title: true } }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.guide_reviews.findMany({
        include: { 
          users: { select: { full_name: true, avatar_url: true } },
          guide_profiles: { include: { users: { select: { full_name: true } } } },
          tours: { select: { title: true } }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.tour_reviews.count(),
      this.prisma.guide_reviews.count()
    ]);

    const tourList = tourReviews.map(r => ({
      id: r.id,
      type: 'TOUR',
      targetName: r.tours.title,
      userName: r.users?.full_name || 'Người dùng ẩn danh',
      userAvatar: r.users?.avatar_url || '',
      rating: r.rating,
      comment: r.comment,
      visibilityStatus: r.visibility_status,
      createdAt: r.created_at
    }));

    const guideList = guideReviews.map(r => ({
      id: r.id,
      type: 'GUIDE',
      targetName: r.guide_profiles.users?.full_name || 'Hướng dẫn viên',
      userName: r.users?.full_name || 'Người dùng ẩn danh',
      userAvatar: r.users?.avatar_url || '',
      rating: r.rating,
      comment: r.comment,
      visibilityStatus: r.visibility_status,
      createdAt: r.created_at
    }));

    return {
      tours: tourList,
      guides: guideList,
      total: totalTour + totalGuide
    };
  }

  async updateReviewVisibility(type: 'TOUR' | 'GUIDE', id: string, status: string) {
    if (type === 'TOUR') {
      return this.prisma.tour_reviews.update({
        where: { id },
        data: { visibility_status: status }
      });
    } else {
      return this.prisma.guide_reviews.update({
        where: { id },
        data: { visibility_status: status }
      });
    }
  }
}
