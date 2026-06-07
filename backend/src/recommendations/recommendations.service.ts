import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

type GuideProfileWithDetails = Prisma.guide_profilesGetPayload<{
  include: {
    users: { select: { full_name: true; avatar_url: true; phone: true } };
    guide_languages: true;
  };
}>;

@Injectable()
export class RecommendationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async trackActivity(userId: string, tourId: string, action: string) {
    try {
      await this.prisma.user_activities.create({
        data: {
          user_id: userId,
          tour_id: tourId,
          action: action,
        },
      });
      // Xóa cache khi có activity mới
      await this.cacheManager.del(`recs_${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw new InternalServerErrorException('Failed to track activity');
    }
  }

  async getRecommendations(userId: string) {
    try {
      const cacheKey = `recs_${userId}`;
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      // 1. Lấy thông tin sở thích của user
      const userPrefs = await this.prisma.user_preferences.findUnique({
        where: { user_id: userId },
      });

      const userCategories =
        await this.prisma.user_preferred_categories.findMany({
          where: { user_id: userId },
          select: { category_id: true },
        });

      const categoryIds = userCategories.map((c) => Number(c.category_id));

      // 1.5 Lấy lịch sử activity của user
      const recentActivities = await this.prisma.user_activities.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 50,
      });
      const interactedTourIds = new Set(recentActivities.map((a) => a.tour_id));
      const favoriteTourIds = new Set(
        recentActivities
          .filter((a) => a.action === 'FAVORITE')
          .map((a) => a.tour_id),
      );

      // 2. Lấy danh sách tour public (visible & published)
      const tours = await this.prisma.tours.findMany({
        where: {
          visibility_status: 'visible',
          business_status: 'published',
          deleted_at: null,
        },
        include: {
          tour_categories: true,
          tour_images: true,
          tour_schedules: {
            where: {
              start_date: { gte: new Date() },
              status: 'available',
            },
            include: {
              tour_requests: {
                where: { status: { in: ['approved', 'paid'] } },
                select: { participant_count: true },
              },
            },
            orderBy: { start_date: 'asc' },
          },
          tour_requests: {
            where: {
              status: { in: ['approved', 'paid'] },
            },
            select: { participant_count: true },
          },
          guide_profiles: {
            include: {
              users: {
                select: { full_name: true, avatar_url: true, phone: true },
              },
              guide_languages: true,
            },
          },
          tour_reviews: true,
        },
      });

      // 3. Lọc và Chấm điểm (Rule-based)
      const scoredTours = tours
        .map((tour) => {
          // Chặn hiển thị Tour nếu Guide chưa đạt 100% độ hoàn thiện
          if (!this.isGuideProfileComplete(tour.guide_profiles)) {
            return null;
          }

          // Tìm lịch khởi hành tiếp theo còn chỗ
          const nextAvailableSchedule = tour.tour_schedules.find((s) => {
            const bookedCount = s.tour_requests.reduce(
              (sum, req) => sum + req.participant_count,
              0,
            );
            return bookedCount < s.max_participants;
          });

          // Nếu không có lịch tương lai, kiểm tra ngày start_date chính
          if (!nextAvailableSchedule) {
            const isMainDateFuture =
              tour.start_date && tour.start_date >= new Date();
            const isMainDateNull = tour.start_date === null;

            // Nếu cả ngày chính cũng không hợp lệ, loại bỏ tour
            if (!isMainDateFuture && !isMainDateNull) {
              return null;
            }
          }

          // Tính toán rating thực tế từ tour_reviews
          const visibleReviews = tour.tour_reviews.filter(
            (r) => r.visibility_status === 'visible',
          );
          const avgRating =
            visibleReviews.length > 0
              ? Number(
                  (
                    visibleReviews.reduce((sum, r) => sum + r.rating, 0) /
                    visibleReviews.length
                  ).toFixed(1),
                )
              : 0.0;

          let score = 0;
          const reasons: string[] = [];

          // Tiêu chí 1: Category
          if (
            tour.category_id &&
            categoryIds.includes(Number(tour.category_id))
          ) {
            score += 5;
            reasons.push('Phù hợp thể loại yêu thích');
          }

          // Tiêu chí 2: Budget (Ngân sách)
          const tourPrice = nextAvailableSchedule
            ? Number(nextAvailableSchedule.price)
            : Number(tour.price);
          if (userPrefs?.budget_max) {
            const maxBudget = Number(userPrefs.budget_max);
            if (tourPrice <= maxBudget) {
              score += 2;
              reasons.push('Phù hợp ngân sách');
            }
          }

          // Tiêu chí 3: Extra Preferences (VD: khu vực, phong cách)
          if (userPrefs?.extra_preferences) {
            try {
              const extra = userPrefs.extra_preferences as Record<
                string,
                unknown
              >;
              if (Array.isArray(extra.provinces)) {
                if (extra.provinces.includes(tour.province)) {
                  score += 3;
                  reasons.push('Khu vực bạn quan tâm');
                }
              }
            } catch {
              // ignore
            }
          }

          // Tiêu chí 4: Rating cao
          if (avgRating >= 4.0) {
            score += 2;
            reasons.push('Tour có đánh giá tốt');
          }

          // Tiêu chí 5: Lịch sử tương tác
          if (favoriteTourIds.has(tour.id)) {
            score += 4;
            reasons.push('Tour bạn đã yêu thích');
          } else if (interactedTourIds.has(tour.id)) {
            score += 1;
            reasons.push('Tour bạn đã xem gần đây');
          }

          const currentParticipants = nextAvailableSchedule
            ? nextAvailableSchedule.tour_requests.reduce(
                (sum, req) => sum + req.participant_count,
                0,
              )
            : tour.tour_requests.reduce(
                (sum, req) => sum + req.participant_count,
                0,
              );

          const remainingSlots = nextAvailableSchedule
            ? Math.max(
                0,
                nextAvailableSchedule.max_participants - currentParticipants,
              )
            : Math.max(0, tour.max_participants - currentParticipants);

          const coverImg =
            tour.tour_images?.find((img) => img.is_cover)?.image_url ||
            tour.tour_images?.[0]?.image_url ||
            'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image';

          return {
            id: tour.id,
            title: tour.title,
            cover: coverImg,
            price: tourPrice,
            rating: avgRating,
            location: tour.province,
            province: tour.province,
            startDate: nextAvailableSchedule
              ? nextAvailableSchedule.start_date
              : tour.start_date,
            endDate: tour.end_date,
            numDays: tour.num_days,
            numNights: tour.num_nights,
            maxParticipants: nextAvailableSchedule
              ? nextAvailableSchedule.max_participants
              : tour.max_participants,
            remainingSlots,
            category: tour.tour_categories?.name || 'Chưa phân loại',
            categoryId: tour.category_id ? tour.category_id.toString() : null,
            match_score: score,
            match_reasons:
              reasons.length > 0 ? reasons : ['Có thể bạn sẽ thích'],
          };
        })
        .filter((t): t is Exclude<typeof t, null> => t !== null);

      // Nếu user chưa cài đặt sở thích, trả về top tour bất kỳ đã lọc
      if (!userPrefs && categoryIds.length === 0) {
        return scoredTours.slice(0, 10);
      }

      // 4. Sắp xếp điểm giảm dần
      scoredTours.sort((a, b) => b.match_score - a.match_score);

      // Trả về top 10 gợi ý tốt nhất
      const result = scoredTours.slice(0, 10);

      // Lưu cache 1 giờ (3600000 ms)
      await this.cacheManager.set(cacheKey, result, 3600000);
      return result;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new InternalServerErrorException('Failed to get recommendations');
    }
  }

  private isGuideProfileComplete(
    g: GuideProfileWithDetails | null | undefined,
  ): boolean {
    if (!g) return false;

    // 1. Họ và tên
    if (!g.users?.full_name || g.users.full_name.trim() === '') return false;

    // 2. Ảnh đại diện (avatar) - ưu tiên avatar_url trong guide_profile hoặc fallback trong users
    const avatar = g.avatar_url || g.users?.avatar_url;
    if (!avatar || avatar.trim() === '') return false;

    // 3. Số điện thoại
    if (!g.users?.phone || g.users.phone.trim() === '') return false;

    // 4. Giới thiệu bản thân (tối thiểu 20 ký tự)
    if (!g.bio || g.bio.trim().length < 20) return false;

    // 5. Số năm kinh nghiệm
    if (g.years_of_experience === null || g.years_of_experience === undefined)
      return false;

    // 6. Tỉnh thành hoạt động chính
    if (!g.home_province_id) return false;

    // 7. Ngôn ngữ thông thạo (phải có ít nhất 1 ngôn ngữ)
    if (!g.guide_languages || g.guide_languages.length === 0) return false;

    // 8. Xác minh danh tính
    if (
      g.verification_status !== 'approved' &&
      g.verification_status !== 'verified'
    )
      return false;

    return true;
  }
}
