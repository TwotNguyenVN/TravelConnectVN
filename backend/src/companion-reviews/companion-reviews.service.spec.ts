import { Test, TestingModule } from '@nestjs/testing';
import { CompanionReviewsService } from './companion-reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

describe('CompanionReviewsService', () => {
  let service: CompanionReviewsService;

  const mockPrismaService = {
    companion_requests: {
      findUnique: jest.fn(),
    },
    companion_reviews: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockActivityLogsService = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanionReviewsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UserActivityLogsService, useValue: mockActivityLogsService },
      ],
    }).compile();

    service = module.get<CompanionReviewsService>(CompanionReviewsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      postId: 'post-1',
      requestId: 'req-1',
      rating: 5,
      comment: 'Chuyến đi tuyệt vời!',
    };
    const userId = 'user-1';

    it('should throw NotFoundException when companion request does not exist', async () => {
      mockPrismaService.companion_requests.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user does not own the request', async () => {
      mockPrismaService.companion_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: 'other-user',
        status: 'approved',
        companion_posts: {
          title: 'Đi Phượt Hà Giang',
          user_id: 'host-1',
          end_date: new Date('2026-05-20'),
        },
      });

      await expect(service.create(userId, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException when request status is not approved', async () => {
      mockPrismaService.companion_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: userId,
        status: 'pending',
        companion_posts: {
          title: 'Đi Phượt Hà Giang',
          user_id: 'host-1',
          end_date: new Date('2026-05-20'),
        },
      });

      await expect(service.create(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when trip has not ended yet', async () => {
      // Set end_date in future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      mockPrismaService.companion_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: userId,
        status: 'approved',
        companion_posts: {
          title: 'Đi Phượt Hà Giang',
          user_id: 'host-1',
          end_date: futureDate,
        },
      });

      await expect(service.create(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when review already exists for the request', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      mockPrismaService.companion_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        user_id: userId,
        status: 'approved',
        companion_posts: {
          title: 'Đi Phượt Hà Giang',
          user_id: 'host-1',
          end_date: pastDate,
        },
      });

      mockPrismaService.companion_reviews.findUnique.mockResolvedValue({
        id: 'review-1',
      });

      await expect(service.create(userId, dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create companion review successfully with valid data', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      const mockRequest = {
        id: 'req-1',
        user_id: userId,
        status: 'approved',
        companion_posts: {
          title: 'Đi Phượt Hà Giang',
          user_id: 'host-1',
          end_date: pastDate,
        },
      };

      const mockReview = {
        id: 'review-1',
        post_id: 'post-1',
        request_id: 'req-1',
        user_id: userId,
        host_id: 'host-1',
        rating: 5,
        comment: 'Chuyến đi tuyệt vời!',
        visibility_status: 'visible',
      };

      mockPrismaService.companion_requests.findUnique.mockResolvedValue(
        mockRequest,
      );
      mockPrismaService.companion_reviews.findUnique.mockResolvedValue(null);
      mockPrismaService.companion_reviews.create.mockResolvedValue(mockReview);

      const result = await service.create(userId, dto);

      expect(result).toEqual(mockReview);
      expect(mockPrismaService.companion_reviews.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          post_id: 'post-1',
          request_id: 'req-1',
          user_id: userId,
          host_id: 'host-1',
          rating: 5,
          comment: 'Chuyến đi tuyệt vời!',
        }),
      });

      expect(mockActivityLogsService.log).toHaveBeenCalledWith(
        userId,
        'review.companion_created',
        'COMPANION_REVIEW',
        'review-1',
        expect.objectContaining({ rating: 5 }),
      );
    });
  });
});
