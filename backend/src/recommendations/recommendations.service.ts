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
          OR: [
            { start_date: { gte: new Date() } },
            { start_date: null }
          ],
        },
        include: {
          tour_categories: true,
          tour_images: true,
          tour_requests: {
            where: {
              status: { in: ['approved', 'paid'] }
            }
          },
          guide_profiles: {
            include: {
              users: {
                select: { full_name: true, avatar_url: true },
              },
            },
          },
        },
        take: 20, // Giới hạn lấy 20 tour để chấm điểm
      });

      // Nếu user chưa cài đặt sở thích, trả về ngẫu nhiên / mới nhất
      if (!userPrefs && categoryIds.length === 0) {
        return tours.map((tour) => {
          const currentParticipants = (tour as any).tour_requests.reduce((sum, req) => sum + req.participant_count, 0);
          const remainingSlots = Math.max(0, tour.max_participants - currentParticipants);
          
          return {
            ...tour,
            remainingSlots,
            match_score: 0,
            match_reasons: ['Gợi ý thịnh hành'],
          };
        }).slice(0, 10); // Lấy 10 tour
      }

      // 3. Chấm điểm (Rule-based)
      const scoredTours = tours.map((tour) => {
        let score = 0;
        const reasons: string[] = [];

        // Tiêu chí 1: Category
        if (tour.category_id && categoryIds.includes(Number(tour.category_id))) {
          score += 5;
          reasons.push('Phù hợp thể loại yêu thích');
        }

        // Tiêu chí 2: Budget (Ngân sách)
        if (userPrefs?.budget_max) {
          const tourPrice = Number(tour.price);
          const maxBudget = Number(userPrefs.budget_max);
          if (tourPrice <= maxBudget) {
            score += 2;
            reasons.push('Phù hợp ngân sách');
          }
        }

        // Tiêu chí 3: Extra Preferences (VD: khu vực, phong cách)
        // Parse extra_preferences nếu có
        if (userPrefs?.extra_preferences) {
          try {
            const extra = userPrefs.extra_preferences as any;
            if (extra.provinces && Array.isArray(extra.provinces)) {
              if (extra.provinces.includes(tour.province)) {
                score += 3;
                reasons.push('Khu vực bạn quan tâm');
              }
            }
          } catch (e) {
            // ignore JSON parse error
          }
        }

        const currentParticipants = (tour as any).tour_requests.reduce((sum, req) => sum + req.participant_count, 0);
        const remainingSlots = Math.max(0, tour.max_participants - currentParticipants);

        // Đảm bảo kiểu bigInt trả về API được serialize
        return {
          ...tour,
          remainingSlots,
          category_id: tour.category_id ? tour.category_id.toString() : null,
          match_score: score,
          match_reasons: reasons.length > 0 ? reasons : ['Có thể bạn sẽ thích'],
        };
      });

      // 4. Sắp xếp điểm giảm dần và loại các tour điểm 0 (nếu có đủ data), hoặc trả về top
      scoredTours.sort((a, b) => b.match_score - a.match_score);

      // Trả về top 10 gợi ý tốt nhất
      return scoredTours.slice(0, 10);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new InternalServerErrorException('Failed to get recommendations');
    }
  }
}
