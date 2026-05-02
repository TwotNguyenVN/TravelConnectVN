import { Test, TestingModule } from '@nestjs/testing';
import { ToursService } from './tours.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

/**
 * Unit Tests cho ToursService
 * Kiểm tra các chức năng lõi: lấy danh sách tour, chi tiết tour, danh mục
 */
describe('ToursService', () => {
  let service: ToursService;
  let prisma: PrismaService;

  // Mock PrismaService — không kết nối DB thật
  const mockPrismaService = {
    tours: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    tour_categories: {
      findMany: jest.fn(),
    },
    tour_reviews: {
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    guide_reviews: {
      aggregate: jest.fn(),
    },
    guide_profiles: {
      findMany: jest.fn(),
    },
    companion_posts: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // TEST 1: getPublicTours — Lấy danh sách tour
  // ============================================
  describe('getPublicTours', () => {
    it('should return paginated tours with correct structure', async () => {
      const mockTours = [
        {
          id: 'tour-1',
          title: 'Tour Đà Nẵng 3 ngày',
          description: 'Khám phá Đà Nẵng',
          price_per_person: 2500000,
          duration_days: 3,
          max_participants: 10,
          business_status: 'published',
          visibility_status: 'visible',
          tour_images: [{ image_url: 'https://example.com/img.jpg', is_cover: true }],
          tour_categories: { name: 'Biển đảo', slug: 'bien-dao' },
          guide_profiles: {
            user_id: 'guide-1',
            users: { full_name: 'Nguyễn HDV', avatar_url: null },
          },
          tour_destinations: [],
        },
      ];

      mockPrismaService.tours.findMany.mockResolvedValue(mockTours);
      mockPrismaService.tours.count.mockResolvedValue(1);

      const result = await service.getPublicTours({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result.data).toHaveLength(1);
      expect(mockPrismaService.tours.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.tours.count).toHaveBeenCalledTimes(1);
    });

    it('should apply default pagination when no params provided', async () => {
      mockPrismaService.tours.findMany.mockResolvedValue([]);
      mockPrismaService.tours.count.mockResolvedValue(0);

      const result = await service.getPublicTours({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data).toEqual([]);
    });
  });

  // ============================================
  // TEST 2: getPublicTourDetail — Chi tiết tour
  // ============================================
  describe('getPublicTourDetail', () => {
    it('should throw NotFoundException when tour does not exist', async () => {
      mockPrismaService.tours.findUnique.mockResolvedValue(null);

      await expect(service.getPublicTourDetail('non-existent-id'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should return tour detail with related data', async () => {
      const mockTour = {
        id: 'tour-1',
        title: 'Tour Hội An',
        description: 'Phố cổ Hội An',
        price_per_person: 1800000,
        duration_days: 2,
        max_participants: 8,
        business_status: 'published',
        visibility_status: 'visible',
        created_at: new Date(),
        tour_images: [],
        tour_locations: [],
        tour_schedules: [],
        tour_destinations: [],
        tour_categories: { name: 'Văn hóa', slug: 'van-hoa' },
        guide_profiles: {
          id: 'gp-1',
          user_id: 'guide-1',
          bio: 'HDV kinh nghiệm',
          years_of_experience: 5,
          verification_status: 'verified',
          users: { full_name: 'Trần HDV', avatar_url: null },
          guide_languages: [],
          guide_reviews: [],
        },
        _count: { tour_requests: 3 },
      };

      mockPrismaService.tours.findUnique.mockResolvedValue(mockTour);
      mockPrismaService.tour_reviews.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });
      mockPrismaService.guide_reviews.aggregate.mockResolvedValue({ _avg: { rating: 4.8 } });

      const result = await service.getPublicTourDetail('tour-1');

      expect(result).toHaveProperty('id', 'tour-1');
      expect(result).toHaveProperty('title', 'Tour Hội An');
      expect(result).toHaveProperty('guide');
      expect(mockPrismaService.tours.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: 'tour-1' }),
        })
      );
    });
  });

  // ============================================
  // TEST 3: getTourCategories — Danh mục tour
  // ============================================
  describe('getTourCategories', () => {
    it('should return list of categories', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Biển đảo', slug: 'bien-dao' },
        { id: 'cat-2', name: 'Núi rừng', slug: 'nui-rung' },
        { id: 'cat-3', name: 'Văn hóa', slug: 'van-hoa' },
      ];

      mockPrismaService.tour_categories.findMany.mockResolvedValue(mockCategories);

      const result = await service.getTourCategories();

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('name', 'Biển đảo');
      expect(mockPrismaService.tour_categories.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
