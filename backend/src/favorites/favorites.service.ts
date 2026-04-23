import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: UserActivityLogsService,
  ) {}


  // ==========================================
  // TOUR FAVORITES
  // ==========================================

  async addTourFavorite(userId: string, tourId: string) {
    // 1. Check if tour exists
    const tour = await this.prisma.tours.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    // 2. Check if already favorited
    const existing = await this.prisma.favorite_tours.findUnique({
      where: {
        user_id_tour_id: {
          user_id: userId,
          tour_id: tourId,
        },
      },
    });

    if (existing) {
      return existing; // Or throw ConflictException if strict
    }

    // 3. Create
    const favorite = await this.prisma.favorite_tours.create({
      data: {
        user_id: userId,
        tour_id: tourId,
      },
    });

    // 4. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'favorite.tour_added',
      'TOUR',
      tourId,
      { title: tour.title },
    );

    return favorite;

  }

  async removeTourFavorite(userId: string, tourId: string) {
    try {
      await this.prisma.favorite_tours.delete({
        where: {
          user_id_tour_id: {
            user_id: userId,
            tour_id: tourId,
          },
        },
      });
      return { success: true };
    } catch (error) {
      // If not found, we can consider it "removed" or throw
      return { success: true };
    }
  }

  async getMyFavoriteTours(userId: string) {
    const favorites = await this.prisma.favorite_tours.findMany({
      where: { user_id: userId },
      include: {
        tours: {
          include: {
            tour_categories: true,
            tour_images: {
              where: { is_cover: true },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return favorites.map((f) => ({
      id: f.tours.id,
      title: f.tours.title,
      cover: f.tours.tour_images?.[0]?.image_url || 'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image',
      price: Number(f.tours.price),
      location: f.tours.province,
      category: f.tours.tour_categories?.name || 'Chưa phân loại',
      favoritedAt: f.created_at,
    }));
  }

  // ==========================================
  // GUIDE FAVORITES
  // ==========================================

  async addGuideFavorite(userId: string, guideId: string) {
    // 1. Check if guide exists
    const guide = await this.prisma.guide_profiles.findUnique({
      where: { id: guideId },
    });

    if (!guide) {
      throw new NotFoundException('Hướng dẫn viên không tồn tại');
    }

    // 2. Check if already favorited
    const existing = await this.prisma.favorite_guides.findUnique({
      where: {
        user_id_guide_profile_id: {
          user_id: userId,
          guide_profile_id: guideId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // 3. Create
    const favorite = await this.prisma.favorite_guides.create({
      data: {
        user_id: userId,
        guide_profile_id: guideId,
      },
      include: {
        guide_profiles: {
          include: { users: true }
        }
      }
    });

    // 4. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'favorite.guide_added',
      'GUIDE_PROFILE',
      guideId,
      { name: favorite.guide_profiles.users?.full_name || 'Hướng dẫn viên' },
    );

    return favorite;

  }

  async removeGuideFavorite(userId: string, guideId: string) {
    try {
      await this.prisma.favorite_guides.delete({
        where: {
          user_id_guide_profile_id: {
            user_id: userId,
            guide_profile_id: guideId,
          },
        },
      });
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  }

  async getMyFavoriteGuides(userId: string) {
    const favorites = await this.prisma.favorite_guides.findMany({
      where: { user_id: userId },
      include: {
        guide_profiles: {
          include: {
            users: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return favorites.map((f) => ({
      id: f.guide_profiles.id,
      name: f.guide_profiles.users?.full_name || 'Hướng dẫn viên',
      avatar: f.guide_profiles.avatar_url || '',
      location: f.guide_profiles.working_area || 'Việt Nam',
      verificationStatus: f.guide_profiles.verification_status,
      favoritedAt: f.created_at,
    }));
  }
}
