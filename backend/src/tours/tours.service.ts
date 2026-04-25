import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
      const categoryIds = filter.categoryId.split(',').filter(Boolean).map(id => BigInt(id.trim()));
      if (categoryIds.length > 0) {
        where.category_id = { in: categoryIds };
      }
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
      duration: t.duration || (t.start_date && t.end_date ? `${Math.ceil((t.end_date.getTime() - t.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày` : 'Chưa xác định'),
      category: t.tour_categories?.name || 'Chưa phân loại',
      categoryId: t.category_id?.toString(),
      maxParticipants: t.max_participants,
      numDays: t.num_days,
      numNights: t.num_nights,
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
    const images = Array.isArray(tour.tour_images) 
      ? tour.tour_images.map(img => img.image_url) 
      : [];
    
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
      rating: aggregate._avg.rating || 5.0,
      location: tour.province,
      duration: tour.duration || (tour.start_date && tour.end_date ? `${Math.ceil((tour.end_date.getTime() - tour.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày` : 'Chưa xác định'),
      numDays: tour.num_days,
      numNights: tour.num_nights,
      startDate: tour.start_date,
      endDate: tour.end_date,
      category: tour.tour_categories?.name || 'Chưa phân loại',
      categoryId: tour.category_id?.toString(),
      reviewsCount: (tour as any)._count?.tour_reviews || 0,
      maxParticipants: tour.max_participants,
      meetPoint: tour.meet_point || tour.province,
      meetAddress: tour.meet_address,
      meetTime: tour.meet_time,
      description: tour.description || 'Chưa có mô tả chi tiết.',
      participantRequirements: tour.participant_requirements,
      images: images,
      guideId: (tour as any).guide_profiles?.user_id,
      guide: {
        name: (tour as any).guide_profiles?.users?.full_name || 'Hướng dẫn viên',
        avatar: (tour as any).guide_profiles?.avatar_url || '',
        exp: `${(tour as any).guide_profiles?.years_of_experience || 0} năm`,
        bio: (tour as any).guide_profiles?.bio || 'Chưa có giới thiệu.',
      },
      itinerary: ((tour as any).tour_locations || []).map((loc: any) => ({
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
      duration: t.duration || (t.start_date && t.end_date ? `${Math.ceil((t.end_date.getTime() - t.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày` : 'Chưa xác định'),
      category: t.tour_categories?.name || 'Chưa phân loại',
      categoryId: t.category_id?.toString(),
    }));
  }

  async getFeaturedGuides() {
    const guides = await this.prisma.guide_profiles.findMany({
      where: {
        visibility_status: 'visible',
        verification_status: { in: ['approved', 'verified'] },
        bio: { not: null, notIn: [''] },
        years_of_experience: { not: null },
        home_province_id: { not: null },
        guide_languages: { some: {} },
        users: {
          full_name: { not: null, notIn: [''] },
          avatar_url: { not: null, notIn: [''] },
          phone: { not: null, notIn: [''] },
        },
      },
      include: {
        users: true,
      },
      take: 4,
    });

    return guides.map((g) => ({
      id: g.id,
      name: g.users?.full_name || 'Hướng dẫn viên',
      avatar: g.users?.avatar_url || '',
      coverUrl: g.cover_url || g.users?.avatar_url || '',
      location: g.working_area || 'Việt Nam',
      yearsOfExperience: g.years_of_experience || 0,
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

    // 2. Thực hiện tạo tour và các dữ liệu liên quan trong một transaction
    return this.prisma.$transaction(async (tx) => {
      // 2.1 Tạo tour cơ bản
      const tour = await tx.tours.create({
        data: {
          guide_profile_id: guideProfile.id,
          title: data.title,
          category_id: data.categoryId ? BigInt(data.categoryId) : null,
          province: data.province,
          district: data.district,
          start_date: data.startDate && !isNaN(new Date(data.startDate).getTime()) ? new Date(data.startDate) : null,
          end_date: data.endDate && !isNaN(new Date(data.endDate).getTime()) ? new Date(data.endDate) : null,
          duration: data.duration,
          num_days: (data.numDays !== undefined && data.numDays !== null) ? Number(data.numDays) : null,
          num_nights: (data.numNights !== undefined && data.numNights !== null) ? Number(data.numNights) : null,
          price: data.price,
          max_participants: Number(data.maxParticipants),
          meet_point: data.meetPoint,
          meet_address: data.meetAddress,
          meet_time: data.meetTime,
          meet_latitude: data.meetLatitude,
          meet_longitude: data.meetLongitude,
          google_maps_link: data.googleMapsLink,
          route_map_link: data.routeMapLink,
          description: data.description,
          participant_requirements: data.participantRequirements,
          business_status: data.businessStatus || 'draft',
          visibility_status: data.visibilityStatus || 'visible',
          published_at: data.businessStatus === 'published' ? new Date() : null,
        },
      });

      // 2.2 Tạo lịch trình (Itinerary)
      if (data.itinerary && Array.isArray(data.itinerary)) {
        const itineraryData = data.itinerary.map((item, idx) => ({
          tour_id: tour.id,
          sequence_no: idx + 1,
          location_name: item.locationName,
          address: item.address || '',
          notes: item.notes,
          has_breakfast: !!item.hasBreakfast,
          has_lunch: !!item.hasLunch,
          has_dinner: !!item.hasDinner,
          accommodation_info: item.accommodation || '',
          highlight_note: item.note || '',
          latitude: item.latitude,
          longitude: item.longitude,
          visit_time: item.visitTime ? new Date(item.visitTime) : null,
        }));

        if (itineraryData.length > 0) {
          await tx.tour_locations.createMany({
            data: itineraryData,
          });
        }
      }

      // 2.3 Tạo điểm ghé thăm (Destinations)
      if (data.destinations && Array.isArray(data.destinations)) {
        const destinationData = data.destinations.map((dest, index) => ({
          tour_id: tour.id,
          sequence_no: index + 1,
          name: dest.name,
          address: dest.address,
          google_maps_link: dest.googleMapsLink,
        }));

        if (destinationData.length > 0) {
          await tx.tour_destinations.createMany({
            data: destinationData,
          });
        }
      }

      // 2.3 Tạo thư viện ảnh (Media)
      if (data.images && Array.isArray(data.images)) {
        const imagesData = data.images.map((img, index) => ({
          tour_id: tour.id,
          image_url: img.imageUrl,
          caption: img.caption || '',
          sort_order: index,
          is_cover: img.isCover || false,
        }));

        if (imagesData.length > 0) {
          await tx.tour_images.createMany({
            data: imagesData,
          });
        }
      }

      // 2.4 Gắn nơi lưu trú (Accommodations)
      if (data.accommodations && Array.isArray(data.accommodations)) {
        const accData = data.accommodations.map((acc, index) => ({
          tour_id: tour.id,
          accommodation_id: acc.accommodationId,
          check_in_date: acc.checkInDate && !isNaN(new Date(acc.checkInDate).getTime()) ? new Date(acc.checkInDate) : null,
          check_out_date: acc.checkOutDate && !isNaN(new Date(acc.checkOutDate).getTime()) ? new Date(acc.checkOutDate) : null,
          notes: acc.notes,
          sort_order: index,
        }));

        if (accData.length > 0) {
          await tx.tour_accommodations.createMany({
            data: accData,
          });
        }
      }

      return tour;
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

    // 3. Thực hiện cập nhật trong một transaction
    return this.prisma.$transaction(async (tx) => {
      // 3.1 Cập nhật thông tin cơ bản của tour
      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.categoryId) updateData.category_id = BigInt(data.categoryId);
      if (data.province) updateData.province = data.province;
      if (data.district !== undefined) updateData.district = data.district;
      if (data.startDate) updateData.start_date = !isNaN(new Date(data.startDate).getTime()) ? new Date(data.startDate) : null;
      if (data.endDate) updateData.end_date = !isNaN(new Date(data.endDate).getTime()) ? new Date(data.endDate) : null;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.numDays !== undefined) updateData.num_days = (data.numDays !== null) ? Number(data.numDays) : null;
      if (data.numNights !== undefined) updateData.num_nights = (data.numNights !== null) ? Number(data.numNights) : null;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.maxParticipants !== undefined) updateData.max_participants = Number(data.maxParticipants);
      if (data.meetPoint !== undefined) updateData.meet_point = data.meetPoint;
      if (data.meetAddress !== undefined) updateData.meet_address = data.meetAddress;
      if (data.meetTime !== undefined) updateData.meet_time = data.meetTime;
      if (data.meetLatitude !== undefined) updateData.meet_latitude = data.meetLatitude;
      if (data.meetLongitude !== undefined) updateData.meet_longitude = data.meetLongitude;
      if (data.googleMapsLink !== undefined) updateData.google_maps_link = data.googleMapsLink;
      if (data.routeMapLink !== undefined) updateData.route_map_link = data.routeMapLink;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.participantRequirements !== undefined) updateData.participant_requirements = data.participantRequirements;
      if (data.businessStatus) updateData.business_status = data.businessStatus;
      if (data.visibilityStatus) updateData.visibility_status = data.visibilityStatus;

      if (data.businessStatus === 'published' && tour.business_status !== 'published') {
        updateData.published_at = new Date();
      }

      updateData.updated_at = new Date();

      const updatedTour = await tx.tours.update({
        where: { id: tourId },
        data: updateData,
      });

      // 3.2 Cập nhật Lịch trình (Itinerary) nếu có
      if (data.itinerary && Array.isArray(data.itinerary)) {
        await tx.tour_locations.deleteMany({ where: { tour_id: tourId } });
        const itineraryData = data.itinerary.map((item, idx) => ({
          tour_id: tourId,
          sequence_no: idx + 1,
          location_name: item.locationName,
          address: item.address || '',
          notes: item.notes,
          has_breakfast: !!item.hasBreakfast,
          has_lunch: !!item.hasLunch,
          has_dinner: !!item.hasDinner,
          accommodation_info: item.accommodation || '',
          highlight_note: item.note || '',
          latitude: item.latitude,
          longitude: item.longitude,
          visit_time: item.visitTime ? new Date(item.visitTime) : null,
        }));
        if (itineraryData.length > 0) {
          await tx.tour_locations.createMany({ data: itineraryData });
        }
      }

      // 3.3 Cập nhật Điểm ghé thăm (Destinations) nếu có
      if (data.destinations && Array.isArray(data.destinations)) {
        await tx.tour_destinations.deleteMany({ where: { tour_id: tourId } });
        const destinationData = data.destinations.map((dest, index) => ({
          tour_id: tourId,
          sequence_no: index + 1,
          name: dest.name,
          address: dest.address,
          google_maps_link: dest.googleMapsLink,
        }));
        if (destinationData.length > 0) {
          await tx.tour_destinations.createMany({ data: destinationData });
        }
      }

      // 3.4 Cập nhật Thư viện ảnh (Images) nếu có
      if (data.images && Array.isArray(data.images)) {
        await tx.tour_images.deleteMany({ where: { tour_id: tourId } });
        const imagesData = data.images.map((img, index) => ({
          tour_id: tourId,
          image_url: img.imageUrl,
          caption: img.caption || '',
          sort_order: index,
          is_cover: img.isCover || false,
        }));
        if (imagesData.length > 0) {
          await tx.tour_images.createMany({ data: imagesData });
        }
      }

      // 3.5 Cập nhật Nơi lưu trú (Accommodations) nếu có
      if (data.accommodations && Array.isArray(data.accommodations)) {
        await tx.tour_accommodations.deleteMany({ where: { tour_id: tourId } });
        const accData = data.accommodations.map((acc, index) => ({
          tour_id: tourId,
          accommodation_id: acc.accommodationId,
          check_in_date: acc.checkInDate && !isNaN(new Date(acc.checkInDate).getTime()) ? new Date(acc.checkInDate) : null,
          check_out_date: acc.checkOutDate && !isNaN(new Date(acc.checkOutDate).getTime()) ? new Date(acc.checkOutDate) : null,
          notes: acc.notes,
          sort_order: index,
        }));
        if (accData.length > 0) {
          await tx.tour_accommodations.createMany({ data: accData });
        }
      }

      return updatedTour;
    }).catch(error => {
      if (error.code === 'P2002' || error.message?.includes('violates check constraint')) {
        if (error.message?.includes('tours_check')) {
          throw new BadRequestException('Ngày kết thúc không thể trước ngày bắt đầu');
        }
        throw new BadRequestException('Dữ liệu không hợp lệ: ' + error.message);
      }
      throw error;
    });
  }

  async getTourDetailForGuide(userId: string, tourId: string) {
    // 1. Tìm guide profile
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      throw new NotFoundException('Không tìm thấy hồ sơ hướng dẫn viên');
    }

    // 2. Lấy chi tiết tour và tất cả các bảng liên quan
    const tour = await this.prisma.tours.findUnique({
      where: { id: tourId },
      include: {
        tour_locations: { orderBy: { sequence_no: 'asc' } },
        tour_destinations: { orderBy: { sequence_no: 'asc' } },
        tour_images: { orderBy: { sort_order: 'asc' } },
        tour_accommodations: { include: { partner_accommodations: true } },
        tour_categories: true,
        _count: {
          select: {
            tour_requests: {
              where: { status: 'paid' }
            }
          }
        }
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    if (tour.guide_profile_id !== guideProfile.id) {
      throw new NotFoundException('Bạn không có quyền xem tour này');
    }

    return tour;
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
  async deleteTour(userId: string, tourId: string) {
    // 1. Kiểm tra quyền sở hữu
    const tour = await this.prisma.tours.findFirst({
      where: {
        id: tourId,
        guide_profiles: {
          user_id: userId,
        },
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour hoặc bạn không có quyền');
    }

    // 2. Soft delete
    await this.prisma.tours.update({
      where: { id: tourId },
      data: {
        deleted_at: new Date(),
        visibility_status: 'hidden',
      },
    });

    return { success: true, message: 'Xóa tour thành công' };
  }
}
