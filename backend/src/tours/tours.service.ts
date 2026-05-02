import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// Helper to extract coordinates from Google Maps URL
function extractLatLngFromUrl(url: string): { lat: number, lng: number } | null {
  if (!url) return null;
  
  try {
    // Format 1: @10.762622,106.660172
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Format 2: q=10.762622,106.660172
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Format 3: !3d10.762622!4d106.660172
    const d3Match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (d3Match) {
      return { lat: parseFloat(d3Match[1]), lng: parseFloat(d3Match[2]) };
    }

    // Format 4: ll=10.762622,106.660172
    const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
      return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
    }

    // Format 5: place/.../10.762622,106.660172
    const placeMatch = url.match(/place\/[^/]+\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }

    // Format 7: Coordinates in JSON-like arrays [10.774431,106.7027581]
    // Common in Google's internal initialization state
    const arrayMatch = url.match(/\[(\d+\.\d+),(\d+\.\d+)\]/);
    if (arrayMatch) {
      const lat = parseFloat(arrayMatch[1]);
      const lng = parseFloat(arrayMatch[2]);
      if (lat > 8 && lat < 24 && lng > 102 && lng < 110) {
        return { lat, lng };
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  return null;
}

// Helper to resolve short Google Maps link
async function resolveShortLink(url: string): Promise<{ lat: number, lng: number } | null> {
  if (!url) return null;
  
  // If it's already a long link with coordinates, just extract them
  const direct = extractLatLngFromUrl(url);
  if (direct) return direct;

  // If it's a short link, we need to resolve it
  if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps') || url.includes('goo.gl')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(url, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        redirect: 'follow',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Try to extract from final URL
      const fromUrl = extractLatLngFromUrl(response.url);
      if (fromUrl) return fromUrl;

      // If not in URL, maybe it's in the body (meta tags or script)
      const body = await response.text();
      return extractLatLngFromUrl(body);
    } catch (e) {
      console.error('Error resolving short link:', url, e.message);
      return null;
    }
  }
  
  return null;
}

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
      AND: [
        {
          OR: [
            { start_date: { gte: new Date() } },
            { start_date: null }
          ]
        }
      ]
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

    if (filter.startDate) {
      const searchDate = new Date(filter.startDate);
      if (!isNaN(searchDate.getTime())) {
        where.AND.push({
          OR: [
            { start_date: { gte: searchDate } },
            {
              tour_schedules: {
                some: {
                  start_date: { gte: searchDate },
                  status: 'available'
                }
              }
            }
          ]
        });
      }
    }

    if (filter.keyword) {
      where.AND.push({
        OR: [
          { title: { contains: filter.keyword, mode: 'insensitive' } },
          { province: { contains: filter.keyword, mode: 'insensitive' } },
        ]
      });
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
      rating: 0.0,
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
        tour_destinations: {
          orderBy: { sequence_no: 'asc' },
        },
        tour_schedules: {
          where: {
            status: 'available',
            start_date: { gte: new Date() },
          },
          include: {
            tour_requests: {
              where: {
                status: { in: ['approved', 'payment_pending', 'paid'] }
              },
              select: {
                participant_count: true
              }
            }
          },
          orderBy: { start_date: 'asc' },
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

    // Fetch ratings in parallel
    const [tourRating, guideRating] = await Promise.all([
      this.prisma.tour_reviews.aggregate({
        where: { tour_id: id, visibility_status: 'visible' },
        _avg: { rating: true },
      }),
      this.prisma.guide_reviews.aggregate({
        where: { guide_profile_id: (tour as any).guide_profiles?.user_id },
        _avg: { rating: true },
      })
    ]);

    return {
      id: tour.id,
      title: tour.title,
      cover: images[0],
      price: Number(tour.price),
      rating: tourRating._avg.rating || 0.0,
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
      googleMapsLink: tour.google_maps_link,
      routeMapLink: tour.route_map_link,
      description: tour.description || 'Chưa có mô tả chi tiết.',
      participantRequirements: tour.participant_requirements,
      images: images,
      guideId: (tour as any).guide_profiles?.user_id,
      guide: {
        name: (tour as any).guide_profiles?.users?.full_name || 'Hướng dẫn viên',
        avatar: (tour as any).guide_profiles?.avatar_url || '',
        exp: `${(tour as any).guide_profiles?.years_of_experience || 0} năm`,
        bio: (tour as any).guide_profiles?.bio || 'Chưa có giới thiệu.',
        rating: guideRating._avg.rating || 5.0,
      },
      destinations: await Promise.all(((tour as any).tour_destinations || []).map(async (dest: any) => {
        // Log the first one to verify data presence (invisible to user but helps debug)
        if (dest.sequence_no === 1) {
          console.log('DEBUG - Destination 1:', { 
            name: dest.name, 
            lat: dest.latitude, 
            lng: dest.longitude,
            hasLat: 'latitude' in dest
          });
        }

        let lat = dest.latitude ? Number(dest.latitude.toString()) : null;
        let lng = dest.longitude ? Number(dest.longitude.toString()) : null;

        // Fallback: If no coordinates in DB, try to resolve from link
        if ((lat === null || isNaN(lat)) && dest.google_maps_link) {
          const coords = await resolveShortLink(dest.google_maps_link);
          lat = coords?.lat || null;
          lng = coords?.lng || null;
        }

        return {
          id: dest.id,
          name: dest.name,
          address: dest.address,
          googleMapsLink: dest.google_maps_link,
          sequenceNo: dest.sequence_no,
          lat: (lat !== null && !isNaN(lat)) ? lat : null,
          lng: (lng !== null && !isNaN(lng)) ? lng : null,
        };
      })),
      itinerary: ((tour as any).tour_locations || []).map((loc: any) => ({
        day: loc.sequence_no,
        title: loc.location_name,
        address: loc.address,
        notes: loc.notes,
        hasBreakfast: !!loc.has_breakfast,
        hasLunch: !!loc.has_lunch,
        hasDinner: !!loc.has_dinner,
        accommodation: loc.accommodation_info,
        highlight: loc.highlight_note,
        lat: loc.latitude ? Number(loc.latitude) : null,
        lng: loc.longitude ? Number(loc.longitude) : null,
        detail:
          loc.notes ||
          `Tham quan ${loc.location_name} tại ${loc.address || tour.province}.`,
      })),
      schedules: (tour.tour_schedules || []).map((s) => {
        const bookedCount = (s as any).tour_requests?.reduce((sum, req) => sum + req.participant_count, 0) || 0;
        return {
          id: s.id,
          startDate: s.start_date,
          price: Number(s.price),
          maxParticipants: s.max_participants,
          remainingSlots: Math.max(0, s.max_participants - bookedCount),
          status: s.status,
        };
      }),
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
        OR: [
          { start_date: { gte: new Date() } },
          { start_date: null }
        ],
      },
      include: {
        tour_categories: true,
        tour_images: {
          where: { is_cover: true },
        },
        tour_requests: {
          where: {
            status: { in: ['approved', 'paid'] }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 4,
    });

    return tours.map((t) => {
      const currentParticipants = t.tour_requests.reduce((sum, req) => sum + req.participant_count, 0);
      const remainingSlots = Math.max(0, t.max_participants - currentParticipants);

      return {
        id: t.id,
        title: t.title,
        cover:
          (t as any).tour_images?.[0]?.image_url ||
          'https://placehold.co/600x400/e6f0fa/006ce4?text=No+Image',
        price: Number(t.price),
        rating: 0.0,
        location: t.province,
        province: t.province,
        startDate: t.start_date,
        endDate: t.end_date,
        numDays: t.num_days,
        numNights: t.num_nights,
        maxParticipants: t.max_participants,
        remainingSlots: remainingSlots,
        duration: t.duration || (t.start_date && t.end_date ? `${Math.ceil((t.end_date.getTime() - t.start_date.getTime()) / (1000 * 60 * 60 * 24))} ngày` : 'Chưa xác định'),
        category: t.tour_categories?.name || 'Chưa phân loại',
        categoryId: t.category_id?.toString(),
      };
    });
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
        guide_languages: {
          include: {
            languages: true
          }
        }
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
      rating: 0.0,
      languages: g.guide_languages.map(gl => gl.languages.name).join(', '),
      bio: g.bio
    }));
  }

  async getLatestCompanionPosts() {
    const posts = await this.prisma.companion_posts.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        users: true,
      },
      orderBy: { created_at: 'desc' },
      take: 4,
    });

    return posts.map((p) => {
      // images is a Json field, cast it to any[]
      const images = (p.images as any[]) || [];
      const coverImg = images.find((img: any) => img.isCover) || images[0];
      
      return {
        id: p.id,
        title: p.title,
        authorName: p.users?.full_name || 'Người dùng',
        authorAvatar: p.users?.avatar_url || '',
        date: p.created_at,
        destination: p.destination,
        coverUrl: coverImg?.imageUrl || `https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80`,
        estimatedCost: p.estimated_cost,
        expectedMembers: p.expected_members,
        businessStatus: p.business_status,
        visibilityStatus: p.visibility_status,
        requirements: p.requirements
      };
    });
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
          num_days: (data.numDays !== undefined && data.numDays !== null && data.numDays !== "") ? Number(data.numDays) : null,
          num_nights: (data.numNights !== undefined && data.numNights !== null && data.numNights !== "") ? Number(data.numNights) : null,
          price: (data.price !== undefined && data.price !== null && data.price !== "") ? Number(data.price) : 0,
          max_participants: (data.maxParticipants !== undefined && data.maxParticipants !== null && data.maxParticipants !== "") ? Number(data.maxParticipants) : 0,
          meet_point: data.meetPoint,
          meet_address: data.meetAddress,
          meet_time: data.meetTime,
          meet_latitude: (data.meetLatitude !== undefined && data.meetLatitude !== null && data.meetLatitude !== "") ? data.meetLatitude : null,
          meet_longitude: (data.meetLongitude !== undefined && data.meetLongitude !== null && data.meetLongitude !== "") ? data.meetLongitude : null,
          google_maps_link: data.googleMapsLink,
          route_map_link: data.routeMapLink,
          description: data.description,
          participant_requirements: data.participantRequirements,
          business_status: data.businessStatus || 'draft',
          visibility_status: data.visibilityStatus || 'visible',
          published_at: data.businessStatus === 'published' ? new Date() : null,
          other_provinces: data.otherProvinces || [],
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
          latitude: dest.lat !== undefined && dest.lat !== null && dest.lat !== "" ? new Prisma.Decimal(dest.lat) : null,
          longitude: dest.lng !== undefined && dest.lng !== null && dest.lng !== "" ? new Prisma.Decimal(dest.lng) : null,
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

      // 2.4 Tạo lịch khởi hành (Schedules)
      if (data.schedules && Array.isArray(data.schedules)) {
        const scheduleData = data.schedules.map((s) => ({
          tour_id: tour.id,
          start_date: new Date(s.startDate),
          price: s.price ? Number(s.price) : Number(data.price),
          max_participants: s.maxParticipants ? Number(s.maxParticipants) : Number(data.maxParticipants),
          status: 'available',
        }));

        if (scheduleData.length > 0) {
          await tx.tour_schedules.createMany({
            data: scheduleData,
          });
        }
      }

      // 2.5 Gắn nơi lưu trú (Accommodations)
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
      if (data.numDays !== undefined) updateData.num_days = (data.numDays !== null && data.numDays !== "") ? Number(data.numDays) : null;
      if (data.numNights !== undefined) updateData.num_nights = (data.numNights !== null && data.numNights !== "") ? Number(data.numNights) : null;
      if (data.price !== undefined) updateData.price = (data.price !== null && data.price !== "") ? Number(data.price) : 0;
      if (data.maxParticipants !== undefined) updateData.max_participants = (data.maxParticipants !== null && data.maxParticipants !== "") ? Number(data.maxParticipants) : 0;
      if (data.meetPoint !== undefined) updateData.meet_point = data.meetPoint;
      if (data.meetAddress !== undefined) updateData.meet_address = data.meetAddress;
      if (data.meetTime !== undefined) updateData.meet_time = data.meetTime;
      if (data.meetLatitude !== undefined) updateData.meet_latitude = (data.meetLatitude !== null && data.meetLatitude !== "") ? data.meetLatitude : null;
      if (data.meetLongitude !== undefined) updateData.meet_longitude = (data.meetLongitude !== null && data.meetLongitude !== "") ? data.meetLongitude : null;
      if (data.googleMapsLink !== undefined) updateData.google_maps_link = data.googleMapsLink;
      if (data.routeMapLink !== undefined) updateData.route_map_link = data.routeMapLink;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.participantRequirements !== undefined) updateData.participant_requirements = data.participantRequirements;
      if (data.businessStatus) updateData.business_status = data.businessStatus;
      if (data.visibilityStatus) updateData.visibility_status = data.visibilityStatus;
      if (data.otherProvinces !== undefined) updateData.other_provinces = data.otherProvinces;

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
          latitude: dest.lat !== undefined && dest.lat !== null && dest.lat !== "" ? new Prisma.Decimal(dest.lat) : null,
          longitude: dest.lng !== undefined && dest.lng !== null && dest.lng !== "" ? new Prisma.Decimal(dest.lng) : null,
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

      // 3.6 Cập nhật Lịch khởi hành (Schedules) nếu có
      if (data.schedules && Array.isArray(data.schedules)) {
        await tx.tour_schedules.deleteMany({ where: { tour_id: tourId } });
        const scheduleData = data.schedules.map((s) => ({
          tour_id: tourId,
          start_date: new Date(s.startDate),
          price: s.price ? Number(s.price) : Number(updatedTour.price),
          max_participants: s.maxParticipants ? Number(s.maxParticipants) : Number(updatedTour.max_participants),
          status: 'available',
        }));
        if (scheduleData.length > 0) {
          await tx.tour_schedules.createMany({ data: scheduleData });
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
        },
        tour_schedules: {
          orderBy: { start_date: 'asc' },
          include: {
            tour_requests: {
              where: { status: { in: ['paid', 'approved', 'completed'] } },
              select: { participant_count: true }
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

    // Tính tổng số người tham gia cho mỗi lịch trình
    const schedulesWithCounts = tour.tour_schedules.map(schedule => {
      const currentParticipants = schedule.tour_requests.reduce((sum, req) => sum + req.participant_count, 0);
      return {
        ...schedule,
        current_participants: currentParticipants
      };
    });

    return {
      ...tour,
      tour_schedules: schedulesWithCounts
    };
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

  // --- LỊCH KHỞI HÀNH (TOUR SCHEDULES) ---

  async createTourSchedule(userId: string, tourId: string, data: { startDate: string; price: number; maxParticipants: number }) {
    // 1. Kiểm tra quyền sở hữu
    const tour = await this.prisma.tours.findFirst({
      where: {
        id: tourId,
        guide_profiles: { user_id: userId },
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour hoặc bạn không có quyền');
    }

    // 2. Kiểm tra xem ngày này đã có lịch chưa
    const existingSchedule = await this.prisma.tour_schedules.findFirst({
      where: {
        tour_id: tourId,
        start_date: new Date(data.startDate),
      },
    });

    if (existingSchedule) {
      throw new BadRequestException('Ngày này đã có lịch khởi hành');
    }

    // 3. Tạo mới
    return this.prisma.tour_schedules.create({
      data: {
        tour_id: tourId,
        start_date: new Date(data.startDate),
        price: data.price,
        max_participants: data.maxParticipants,
        status: 'available',
      },
    });
  }

  async updateTourSchedule(userId: string, tourId: string, scheduleId: string, data: { price?: number; maxParticipants?: number; status?: string }) {
    // 1. Kiểm tra quyền sở hữu
    const tour = await this.prisma.tours.findFirst({
      where: {
        id: tourId,
        guide_profiles: { user_id: userId },
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour hoặc bạn không có quyền');
    }

    // 2. Cập nhật lịch trình
    const updatedSchedule = await this.prisma.tour_schedules.update({
      where: { id: scheduleId },
      data: {
        ...(data.price !== undefined && { price: data.price }),
        ...(data.maxParticipants !== undefined && { max_participants: data.maxParticipants }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    // 3. Nếu trạng thái là 'completed', cập nhật tất cả các yêu cầu liên quan
    if (data.status === 'completed') {
      await this.prisma.tour_requests.updateMany({
        where: {
          schedule_id: scheduleId,
          status: { in: ['paid', 'approved'] }
        },
        data: {
          status: 'completed'
        }
      });
    }

    return updatedSchedule;
  }

  async deleteTourSchedule(userId: string, tourId: string, scheduleId: string) {
    // 1. Kiểm tra quyền sở hữu
    const tour = await this.prisma.tours.findFirst({
      where: {
        id: tourId,
        guide_profiles: { user_id: userId },
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour hoặc bạn không có quyền');
    }

    // 2. Kiểm tra xem có người đã đặt chưa
    const participants = await this.prisma.tour_requests.count({
      where: {
        schedule_id: scheduleId,
        status: { in: ['paid', 'approved', 'completed'] },
      },
    });

    if (participants > 0) {
      throw new BadRequestException('Không thể xóa lịch đã có người đặt');
    }

    // 3. Xóa
    await this.prisma.tour_schedules.delete({
      where: { id: scheduleId },
    });

    return { success: true, message: 'Xóa lịch thành công' };
  }
}
