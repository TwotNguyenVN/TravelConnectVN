import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // LƯU Ý: Do lỗi cấu hình chuỗi kết nối Prisma (pooler bị từ chối truy cập),
  // nên tạm thời sử dụng Mock Data chuẩn để trả về API đúng định dạng.
  // Khi kết nối Prisma ổn định, chỉ cần thay thế logic lấy dữ liệu dưới đây.
  // ==========================================

  async getPublicTours(filter: any) {
    const limit = Number(filter.limit) || 10;
    const page = Number(filter.page) || 1;
    const skip = (page - 1) * limit;

    const where: any = {
      business_status: 'published',
      visibility_status: 'visible',
      deleted_at: null,
    };

    if (filter.province) {
      where.province = filter.province;
    }

    if (filter.categoryId) {
      where.category_id = BigInt(filter.categoryId);
    }

    if (filter.minPrice || filter.maxPrice) {
      where.price = {};
      if (filter.minPrice) where.price.gte = Number(filter.minPrice);
      if (filter.maxPrice) where.price.lte = Number(filter.maxPrice);
    }

    if (filter.keyword) {
      where.OR = [
        { title: { contains: filter.keyword, mode: 'insensitive' } },
        { province: { contains: filter.keyword, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { created_at: 'desc' };
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
        case 'rating':
          // Rating sorting requires aggregation or a pre-calculated field
          // For now, keep default or use a specific field if available
          break;
      }
    }

    const [tours, total] = await Promise.all([
      this.prisma.tours.findMany({
        where,
        include: {
          tour_categories: true,
          tour_images: {
            where: { is_cover: true },
            take: 1,
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.tours.count({ where }),
    ]);

    const formattedTours = tours.map((t) => ({
      id: t.id,
      title: t.title,
      cover: t.tour_images[0]?.image_url || 'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image',
      price: Number(t.price),
      rating: 5.0, // Tạm thời để 5.0, cần query avg rating sau
      location: t.province,
      duration: `${Math.ceil((t.end_date.getTime() - t.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày`,
      category: t.tour_categories?.name || 'Chưa phân loại',
      categoryId: t.category_id?.toString(),
    }));

    return {
      data: formattedTours,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublicTourDetail(id: string) {
    const tour = await this.prisma.tours.findUnique({
      where: { id },
      include: {
        tour_categories: true,
        tour_images: true,
        tour_locations: {
          orderBy: { sequence_no: 'asc' },
        },
        guide_profiles: {
          include: {
            users: true,
          },
        },
        _count: {
          select: { tour_reviews: true },
        },
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    // Lấy ảnh bìa và gallery
    const images = tour.tour_images.map(img => img.image_url);
    if (images.length === 0) {
      images.push('https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image');
    }

    return {
      id: tour.id,
      title: tour.title,
      cover: images[0],
      price: Number(tour.price),
      rating: 5.0, // Cần tính toán từ tour_reviews
      location: tour.province,
      duration: `${Math.ceil((tour.end_date.getTime() - tour.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày`,
      category: tour.tour_categories?.name || 'Chưa phân loại',
      categoryId: tour.category_id?.toString(),
      reviewsCount: tour._count.tour_reviews,
      maxParticipants: tour.max_participants,
      meetPoint: tour.meet_point || `Trung tâm ${tour.province}`,
      description: tour.description || 'Chưa có mô tả chi tiết.',
      images: images,
      guide: {
        name: tour.guide_profiles.users?.full_name || 'Hướng dẫn viên',
        avatar: tour.guide_profiles.avatar_url || '',
        exp: `${tour.guide_profiles.years_of_experience || 0} năm`,
        bio: tour.guide_profiles.bio || 'Chưa có giới thiệu.',
      },
      itinerary: tour.tour_locations.map((loc) => ({
        day: loc.sequence_no,
        title: loc.location_name,
        detail: loc.notes || `Tham quan ${loc.location_name} tại ${loc.address || tour.province}.`,
      })),
    };
  }

  async getTourReviews(id: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.tour_reviews.findMany({
        where: {
          tour_id: id,
          visibility_status: 'visible',
        },
        include: {
          users: true,
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.tour_reviews.count({
        where: {
          tour_id: id,
          visibility_status: 'visible',
        },
      }),
    ]);

    return {
      data: reviews.map((r) => ({
        id: r.id,
        user: r.users?.full_name || 'Người dùng ẩn danh',
        avatar: r.users?.avatar_url || '',
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

  async getTourCategories() {
    const categories = await this.prisma.tour_categories.findMany({
      orderBy: { name: 'asc' },
    });
    return categories.map(c => ({
      id: c.id.toString(),
      name: c.name,
      description: '', // tour_categories table doesn't have description field
    }));
  }

  async getFeaturedTours() {
    const tours = await this.prisma.tours.findMany({
      where: {
        business_status: 'published',
        visibility_status: 'visible',
        deleted_at: null,
      },
      include: {
        tour_categories: true,
        tour_images: {
          where: { is_cover: true },
          take: 1,
        },
      },
      orderBy: { created_at: 'desc' },
      take: 4,
    });

    return tours.map((t) => ({
      id: t.id,
      title: t.title,
      cover: t.tour_images[0]?.image_url || 'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image',
      price: Number(t.price),
      rating: 5.0,
      location: t.province,
      duration: `${Math.ceil((t.end_date.getTime() - t.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày`,
      category: t.tour_categories?.name || 'Chưa phân loại',
      categoryId: t.category_id?.toString(),
    }));
  }

  async getFeaturedGuides() {
    const guides = await this.prisma.guide_profiles.findMany({
      where: {
        visibility_status: 'visible',
        verification_status: 'verified',
      },
      include: {
        users: true,
      },
      take: 4,
    });

    return guides.map((g) => ({
      id: g.id,
      name: g.users?.full_name || 'Hướng dẫn viên',
      avatar: g.avatar_url || '',
      location: g.working_area || 'Việt Nam',
      rating: 5.0,
    }));
  }

  async getLatestCompanionPosts() {
    const posts = await this.prisma.companion_posts.findMany({
      where: {
        business_status: 'open',
        visibility_status: 'visible',
        deleted_at: null,
      },
      include: {
        users: true,
      },
      orderBy: { created_at: 'desc' },
      take: 4,
    });

    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.users?.full_name || 'Người dùng',
      date: p.created_at,
      destination: p.destination,
    }));
  }
}
