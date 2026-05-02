import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

/**
 * Unit Tests cho ReviewsService
 * Kiểm tra các chức năng: tạo đánh giá tour, lấy danh sách đánh giá,
 * và các validation rule (ownership, status, duplicate)
 */
describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockPrismaService = {
    tour_requests: {
      findUnique: jest.fn(),
    },
    tour_reviews: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    guide_reviews: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockActivityLogsService = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UserActivityLogsService, useValue: mockActivityLogsService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // TEST 1: createTourReview — Validation rules
  // ============================================
  describe('createTourReview', () => {
    const dto = { tourRequestId: 'req-1', rating: 5, comment: 'Tuyệt vời!' };
    const userId = 'user-1';

    it('should throw NotFoundException when tour request does not exist', async () => {
      mockPrismaService.tour_requests.findUnique.mockResolvedValue(null);

      await expect(service.createTourReview(userId, dto))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own the request', async () => {
      mockPrismaService.tour_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: 'other-user',
        status: 'paid',
        tours: { title: 'Tour Test' },
      });

      await expect(service.createTourReview(userId, dto))
        .rejects
        .toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when tour request has invalid status', async () => {
      mockPrismaService.tour_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: userId,
        status: 'pending', // Not in ['approved', 'paid']
        tours: { title: 'Tour Test' },
      });

      await expect(service.createTourReview(userId, dto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw ConflictException when user already reviewed', async () => {
      mockPrismaService.tour_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: userId,
        status: 'paid',
        tour_id: 'tour-1',
        tours: { title: 'Tour Test' },
      });
      mockPrismaService.tour_reviews.findUnique.mockResolvedValue({
        id: 'existing-review',
      });

      await expect(service.createTourReview(userId, dto))
        .rejects
        .toThrow(ConflictException);
    });

    it('should create review successfully with valid data', async () => {
      const mockReview = {
        id: 'review-1',
        tour_id: 'tour-1',
        user_id: userId,
        tour_request_id: 'req-1',
        rating: 5,
        comment: 'Tuyệt vời!',
        visibility_status: 'visible',
      };

      mockPrismaService.tour_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: userId,
        status: 'paid',
        tour_id: 'tour-1',
        tours: { title: 'Tour Đà Nẵng' },
      });
      mockPrismaService.tour_reviews.findUnique.mockResolvedValue(null); // No existing review
      mockPrismaService.tour_reviews.create.mockResolvedValue(mockReview);

      const result = await service.createTourReview(userId, dto);

      expect(result).toEqual(mockReview);
      expect(mockPrismaService.tour_reviews.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tour_id: 'tour-1',
          user_id: userId,
          rating: 5,
          comment: 'Tuyệt vời!',
        }),
      });
      // Verify activity log was called
      expect(mockActivityLogsService.log).toHaveBeenCalledWith(
        userId,
        'review.tour_created',
        'TOUR_REVIEW',
        'review-1',
        expect.objectContaining({ rating: 5 }),
      );
    });
  });

  // ============================================
  // TEST 2: getTourReviews — Pagination
  // ============================================
  describe('getTourReviews', () => {
    it('should return paginated reviews with user info', async () => {
      const mockReviews = [
        {
          id: 'r1',
          rating: 5,
          comment: 'Rất tuyệt',
          created_at: new Date('2026-01-15'),
          users: { full_name: 'Nguyễn A', avatar_url: 'avatar.jpg' },
        },
        {
          id: 'r2',
          rating: 4,
          comment: 'Tốt',
          created_at: new Date('2026-01-10'),
          users: { full_name: 'Trần B', avatar_url: null },
        },
      ];

      mockPrismaService.tour_reviews.findMany.mockResolvedValue(mockReviews);
      mockPrismaService.tour_reviews.count.mockResolvedValue(2);

      const result = await service.getTourReviews('tour-1', 1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.data[0]).toHaveProperty('user', 'Nguyễn A');
      expect(result.data[0]).toHaveProperty('rating', 5);
      expect(result.data[1]).toHaveProperty('user', 'Trần B');
    });

    it('should handle empty reviews list', async () => {
      mockPrismaService.tour_reviews.findMany.mockResolvedValue([]);
      mockPrismaService.tour_reviews.count.mockResolvedValue(0);

      const result = await service.getTourReviews('tour-no-reviews', 1, 10);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });
});
