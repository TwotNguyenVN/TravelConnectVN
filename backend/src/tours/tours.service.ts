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
          tour_images: {
            where: { is_cover: true },
          },
          tour_categories: true,
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
      cover:
        (t as any).tour_images?.[0]?.image_url ||
        'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image',
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
        tour_images: {
          take: 1,
          select: { image_url: true },
        },
        tour_categories: {
          select: { name: true },
        },
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    // Lấy ảnh bìa và gallery
    const images = (tour.tour_images || []).map((img) => img.image_url);
    if (images.length === 0) {
      images.push('https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image');
    }

    // Tính rating trung bình
    const aggregate = await this.prisma.tour_reviews.aggregate({
      where: { tour_id: id, visibility_status: 'visible' },
      _avg: { rating: true },
    });

    return {
      id: tour.id,
      title: tour.title,
      cover: images[0],
      price: Number(tour.price),
      rating: aggregate._avg.rating || 5.0, // Mặc định 5.0 nếu chưa có review
      location: tour.province,
      duration: `${Math.ceil((tour.end_date.getTime() - tour.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày`,
      category: tour.tour_categories?.name || 'Chưa phân loại',
      categoryId: tour.category_id?.toString(),
      reviewsCount: tour._count.tour_reviews,
      maxParticipants: tour.max_participants,
      meetPoint: tour.meet_point || `Trung tâm ${tour.province}`,
      description: tour.description || 'Chưa có mô tả chi tiết.',
      images: images,
      guideId: tour.guide_profiles.user_id,
      guide: {
        name: tour.guide_profiles.users?.full_name || 'Hướng dẫn viên',
        avatar: tour.guide_profiles.avatar_url || '',
        exp: `${tour.guide_profiles.years_of_experience || 0} năm`,
        bio: tour.guide_profiles.bio || 'Chưa có giới thiệu.',
      },
      itinerary: tour.tour_locations.map((loc) => ({
        day: loc.sequence_no,
        title: loc.location_name,
        address: loc.address,
        lat: loc.latitude ? Number(loc.latitude) : null,
        lng: loc.longitude ? Number(loc.longitude) : null,
        detail:
          loc.notes ||
          `Tham quan ${loc.location_name} tại ${loc.address || tour.province}.`,
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
    return categories.map((c) => ({
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
        },
      },
      orderBy: { created_at: 'desc' },
      take: 4,
    });

    return tours.map((t) => ({
      id: t.id,
      title: t.title,
      cover:
        (t as any).tour_images?.[0]?.image_url ||
        'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image',
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
        verification_status: 'approved',
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

  // ==========================================
  // GUIDE MANAGEMENT ENDPOINTS
  // ==========================================

  async getMyGuidedTours(userId: string, filter: any) {
    const limit = Number(filter.limit) || 10;
    const page = Number(filter.page) || 1;
    const skip = (page - 1) * limit;

    // 1. Tìm guide profile của user
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      throw new NotFoundException('Không tìm thấy hồ sơ hướng dẫn viên');
    }

    const where: any = {
      guide_profile_id: guideProfile.id,
      deleted_at: null,
    };

    if (filter.status) {
      where.business_status = filter.status;
    }

    if (filter.keyword) {
      where.title = { contains: filter.keyword, mode: 'insensitive' };
    }

    const [tours, total] = await Promise.all([
      this.prisma.tours.findMany({
        where,
        include: {
          tour_categories: true,
          tour_images: {
            where: { is_cover: true },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.tours.count({ where }),
    ]);

    return {
      data: tours.map((t) => ({
        id: t.id,
        title: t.title,
        cover:
          (t as any).tour_images?.[0]?.image_url ||
          'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image',
        price: Number(t.price),
        startDate: t.start_date,
        endDate: t.end_date,
        businessStatus: t.business_status,
        visibilityStatus: t.visibility_status,
        category: t.tour_categories?.name || 'Chưa phân loại',
        province: t.province,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createTour(userId: string, data: any) {
    // 1. Tìm guide profile
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      throw new NotFoundException('Không tìm thấy hồ sơ hướng dẫn viên');
    }

    // 2. Chuẩn bị dữ liệu
    const tourData: any = {
      guide_profile_id: guideProfile.id,
      title: data.title,
      category_id: data.categoryId ? BigInt(data.categoryId) : null,
      province: data.province,
      district: data.district,
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
      price: data.price,
      max_participants: Number(data.maxParticipants),
      meet_point: data.meetPoint,
      description: data.description,
      participant_requirements: data.participantRequirements,
      business_status: data.businessStatus || 'draft',
      visibility_status: data.visibilityStatus || 'visible',
      published_at: data.businessStatus === 'published' ? new Date() : null,
    };

    // 3. Tạo tour
    return this.prisma.tours.create({
      data: tourData,
    });
  }

  async updateTour(userId: string, tourId: string, data: any) {
    // 1. Tìm guide profile
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      throw new NotFoundException('Không tìm thấy hồ sơ hướng dẫn viên');
    }

    // 2. Kiểm tra ownership
    const tour = await this.prisma.tours.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    if (tour.guide_profile_id !== guideProfile.id) {
      throw new NotFoundException('Bạn không có quyền chỉnh sửa tour này');
    }

    // 3. Chuẩn bị dữ liệu cập nhật
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.categoryId) updateData.category_id = BigInt(data.categoryId);
    if (data.province) updateData.province = data.province;
    if (data.district) updateData.district = data.district;
    if (data.startDate) updateData.start_date = new Date(data.startDate);
    if (data.endDate) updateData.end_date = new Date(data.endDate);
    if (data.price !== undefined) updateData.price = data.price;
    if (data.maxParticipants !== undefined)
      updateData.max_participants = Number(data.maxParticipants);
    if (data.meetPoint !== undefined) updateData.meet_point = data.meetPoint;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.participantRequirements !== undefined)
      updateData.participant_requirements = data.participantRequirements;
    if (data.businessStatus) updateData.business_status = data.businessStatus;
    if (data.visibilityStatus)
      updateData.visibility_status = data.visibilityStatus;

    // Nếu chuyển sang published lần đầu, set published_at
    if (
      data.businessStatus === 'published' &&
      tour.business_status !== 'published'
    ) {
      updateData.published_at = new Date();
    }

    updateData.updated_at = new Date();

    // 4. Cập nhật
    return this.prisma.tours.update({
      where: { id: tourId },
      data: updateData,
    });
  }

  async getTourItinerary(tourId: string) {
    return this.prisma.tour_locations.findMany({
      where: { tour_id: tourId },
      orderBy: { sequence_no: 'asc' },
    });
  }

  async updateTourItinerary(userId: string, tourId: string, locations: any[]) {
    // 1. Tìm guide profile
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      throw new NotFoundException('Không tìm thấy hồ sơ hướng dẫn viên');
    }

    // 2. Kiểm tra ownership
    const tour = await this.prisma.tours.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    if (tour.guide_profile_id !== guideProfile.id) {
      throw new NotFoundException('Bạn không có quyền chỉnh sửa tour này');
    }

    // 3. Thực hiện cập nhật itinerary (Sử dụng transaction để đảm bảo tính toàn vẹn)
    return this.prisma.$transaction(async (tx) => {
      // Xóa tất cả điểm đến cũ
      await tx.tour_locations.deleteMany({
        where: { tour_id: tourId },
      });

      // Thêm các điểm đến mới
      const newLocations = locations.map((loc, index) => ({
        tour_id: tourId,
        sequence_no: index + 1,
        location_name: loc.locationName,
        address: loc.address,
        notes: loc.notes,
        visit_time: loc.visitTime ? new Date(loc.visitTime) : null,
      }));

      if (newLocations.length > 0) {
        await tx.tour_locations.createMany({
          data: newLocations,
        });
      }

      return this.getTourItinerary(tourId);
    });
  }

  async getTourImages(tourId: string) {
    return this.prisma.tour_images.findMany({
      where: { tour_id: tourId },
      orderBy: { sort_order: 'asc' },
    });
  }

  async updateTourImages(userId: string, tourId: string, images: any[]) {
    // 1. Tìm guide profile
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      throw new NotFoundException('Không tìm thấy hồ sơ hướng dẫn viên');
    }

    // 2. Kiểm tra ownership
    const tour = await this.prisma.tours.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    if (tour.guide_profile_id !== guideProfile.id) {
      throw new NotFoundException('Bạn không có quyền chỉnh sửa tour này');
    }

    // 3. Cập nhật ảnh (Batch)
    return this.prisma.$transaction(async (tx) => {
      // Xóa ảnh cũ
      await tx.tour_images.deleteMany({
        where: { tour_id: tourId },
      });

      // Thêm ảnh mới
      const newImages = images.map((img, index) => ({
        tour_id: tourId,
        image_url: img.imageUrl,
        caption: img.caption || '',
        sort_order: index,
        is_cover: img.isCover || false,
      }));

      if (newImages.length > 0) {
        await tx.tour_images.createMany({
          data: newImages,
        });
      }

      return this.getTourImages(tourId);
    });
  }
}
