import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async getRecommendations(userId: string) {
    try {
      // 1. Lấy thông tin sở thích của user
      const userPrefs = await this.prisma.user_preferences.findUnique({
        where: { user_id: userId },
      });

      const userCategories = await this.prisma.user_preferred_categories.findMany({
        where: { user_id: userId },
        select: { category_id: true },
      });

      const categoryIds = userCategories.map((c) => Number(c.category_id));

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
              status: 'available'
            },
            include: {
              tour_requests: {
                where: { status: { in: ['approved', 'paid'] } },
                select: { participant_count: true }
              }
            },
            orderBy: { start_date: 'asc' }
          },
          tour_requests: {
            where: {
              status: { in: ['approved', 'paid'] }
            },
            select: { participant_count: true }
          },
          guide_profiles: {
            include: {
              users: {
                select: { full_name: true, avatar_url: true },
              },
            },
          },
        },
      });

      // 3. Lọc và Chấm điểm (Rule-based)
      const scoredTours = tours
        .map((tour) => {
          // Tìm lịch khởi hành tiếp theo còn chỗ
          const nextAvailableSchedule = tour.tour_schedules.find(s => {
            const bookedCount = s.tour_requests.reduce((sum, req) => sum + req.participant_count, 0);
            return bookedCount < s.max_participants;
          });

          // Nếu không có lịch tương lai, kiểm tra ngày start_date chính
          if (!nextAvailableSchedule) {
            const isMainDateFuture = tour.start_date && tour.start_date >= new Date();
            const isMainDateNull = tour.start_date === null;
            
            // Nếu cả ngày chính cũng không hợp lệ, loại bỏ tour
            if (!isMainDateFuture && !isMainDateNull) {
              return null;
            }
          }

          let score = 0;
          const reasons: string[] = [];

          // Tiêu chí 1: Category
          if (tour.category_id && categoryIds.includes(Number(tour.category_id))) {
            score += 5;
            reasons.push('Phù hợp thể loại yêu thích');
          }

          // Tiêu chí 2: Budget (Ngân sách)
          const tourPrice = nextAvailableSchedule ? Number(nextAvailableSchedule.price) : Number(tour.price);
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
              const extra = userPrefs.extra_preferences as any;
              if (extra.provinces && Array.isArray(extra.provinces)) {
                if (extra.provinces.includes(tour.province)) {
                  score += 3;
                  reasons.push('Khu vực bạn quan tâm');
                }
              }
            } catch (e) {}
          }

          const currentParticipants = nextAvailableSchedule 
            ? nextAvailableSchedule.tour_requests.reduce((sum, req) => sum + req.participant_count, 0)
            : (tour as any).tour_requests.reduce((sum, req) => sum + req.participant_count, 0);
          
          const remainingSlots = nextAvailableSchedule
            ? Math.max(0, nextAvailableSchedule.max_participants - currentParticipants)
            : Math.max(0, tour.max_participants - currentParticipants);

          const coverImg = tour.tour_images?.find(img => img.is_cover)?.image_url || 
                          tour.tour_images?.[0]?.image_url || 
                          'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image';

          return {
            id: tour.id,
            title: tour.title,
            cover: coverImg,
            price: tourPrice,
            rating: 0.0,
            location: tour.province,
            province: tour.province,
            startDate: nextAvailableSchedule ? nextAvailableSchedule.start_date : tour.start_date,
            endDate: tour.end_date,
            numDays: tour.num_days,
            numNights: tour.num_nights,
            maxParticipants: nextAvailableSchedule ? nextAvailableSchedule.max_participants : tour.max_participants,
            remainingSlots,
            category: tour.tour_categories?.name || 'Chưa phân loại',
            categoryId: tour.category_id ? tour.category_id.toString() : null,
            match_score: score,
            match_reasons: reasons.length > 0 ? reasons : ['Có thể bạn sẽ thích'],
          };
        })
        .filter(t => t !== null) as any[];

      // Nếu user chưa cài đặt sở thích, trả về top tour bất kỳ đã lọc
      if (!userPrefs && categoryIds.length === 0) {
        return scoredTours.slice(0, 10);
      }

      // 4. Sắp xếp điểm giảm dần
      scoredTours.sort((a, b) => b.match_score - a.match_score);

      // Trả về top 10 gợi ý tốt nhất
      return scoredTours.slice(0, 10);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new InternalServerErrorException('Failed to get recommendations');
    }
  }
}
