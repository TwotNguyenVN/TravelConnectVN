import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from './recommendations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  const mockPrismaService = {
    user_preferences: {
      findUnique: jest.fn(),
    },
    user_preferred_categories: {
      findMany: jest.fn(),
    },
    tours: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecommendations', () => {
    it('should calculate active ratings and add score for tours with rating >= 4.0', async () => {
      mockPrismaService.user_preferences.findUnique.mockResolvedValue({
        user_id: 'user_123',
        budget_max: 200000,
        extra_preferences: { provinces: ['Hanoi'] },
      });

      mockPrismaService.user_preferred_categories.findMany.mockResolvedValue([]);

      const mockTours = [
        {
          id: 'tour_1',
          title: 'Premium Tour Hanoi',
          province: 'Hanoi',
          price: 150000,
          max_participants: 10,
          start_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          end_date: new Date(),
          num_days: 2,
          num_nights: 1,
          category_id: 1,
          tour_categories: { name: 'Adventure' },
          tour_images: [{ is_cover: true, image_url: 'cover.jpg' }],
          tour_schedules: [],
          tour_requests: [],
          tour_reviews: [
            { rating: 5, visibility_status: 'visible' },
            { rating: 4, visibility_status: 'visible' },
            { rating: 1, visibility_status: 'hidden' }, // visible only
          ],
          guide_profiles: {
            verification_status: 'verified',
            bio: 'Hello this is my long bio for guide profile verification',
            years_of_experience: 3,
            home_province_id: 1,
            guide_languages: ['vi'],
            users: {
              full_name: 'Guide Name',
              avatar_url: 'avatar.jpg',
              phone: '0123456789',
            },
          },
        },
      ];

      mockPrismaService.tours.findMany.mockResolvedValue(mockTours);

      const result = await service.getRecommendations('user_123');

      expect(result).toHaveLength(1);
      // Average visible rating = (5 + 4) / 2 = 4.5
      expect(result[0].rating).toBe(4.5);
      // Match reasons should include high rating reason
      expect(result[0].match_reasons).toContain('Tour có đánh giá tốt');
    });
  });
});
