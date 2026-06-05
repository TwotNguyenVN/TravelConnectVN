import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SchedulerService', () => {
  let service: SchedulerService;

  const mockPrismaService = {
    tour_requests: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    tour_schedules: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    companion_posts: {
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    companion_requests: {
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cancelExpiredUnpaidBookings', () => {
    it('should cancel pending request when starting in less than 24h and paid is 0', async () => {
      const now = new Date();
      const mockPendingRequests = [
        {
          id: 'req-1',
          status: 'pending',
          participant_count: 2,
          tour_schedules: {
            start_date: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
          },
          payment_transactions: [
            { id: 'tx-1', status: 'pending', amount: 50000 },
          ],
        },
      ];

      mockPrismaService.tour_requests.findMany.mockResolvedValue(
        mockPendingRequests,
      );
      mockPrismaService.tour_requests.update.mockResolvedValue({});

      await service.cancelExpiredUnpaidBookings();

      expect(mockPrismaService.tour_requests.update).toHaveBeenCalledWith({
        where: { id: 'req-1' },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({
          status: 'cancelled_by_user',
        }),
      });
    });

    it('should NOT cancel pending request when starting in more than 24h', async () => {
      const now = new Date();
      const mockPendingRequests = [
        {
          id: 'req-2',
          status: 'pending',
          participant_count: 2,
          tour_schedules: {
            start_date: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 48 hours from now
          },
          payment_transactions: [],
        },
      ];

      mockPrismaService.tour_requests.findMany.mockResolvedValue(
        mockPendingRequests,
      );

      await service.cancelExpiredUnpaidBookings();

      expect(mockPrismaService.tour_requests.update).not.toHaveBeenCalled();
    });

    it('should NOT cancel pending request if it has some paid amount', async () => {
      const now = new Date();
      const mockPendingRequests = [
        {
          id: 'req-3',
          status: 'pending',
          participant_count: 2,
          tour_schedules: {
            start_date: new Date(now.getTime() + 12 * 60 * 60 * 1000),
          },
          payment_transactions: [{ id: 'tx-2', status: 'paid', amount: 50000 }],
        },
      ];

      mockPrismaService.tour_requests.findMany.mockResolvedValue(
        mockPendingRequests,
      );

      await service.cancelExpiredUnpaidBookings();

      expect(mockPrismaService.tour_requests.update).not.toHaveBeenCalled();
    });
  });

  describe('completeEndedTours', () => {
    it('should complete tour schedules and requests when end date is past', async () => {
      const now = new Date();
      const mockSchedules = [
        {
          id: 'sch-1',
          status: 'available',
          start_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          tours: {
            title: 'Test Tour',
            num_days: 1,
          },
        },
      ];

      const mockRequests = [
        {
          id: 'req-4',
          status: 'paid',
          tour_schedules: {
            start_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            tours: {
              num_days: 1,
            },
          },
        },
      ];

      mockPrismaService.tour_schedules.findMany.mockResolvedValue(
        mockSchedules,
      );
      mockPrismaService.tour_requests.findMany.mockResolvedValue(mockRequests);

      await service.completeEndedTours();

      expect(mockPrismaService.tour_schedules.update).toHaveBeenCalledWith({
        where: { id: 'sch-1' },
        data: { status: 'completed' },
      });

      expect(mockPrismaService.tour_requests.update).toHaveBeenCalledWith({
        where: { id: 'req-4' },
        data: { status: 'completed' },
      });
    });
  });

  describe('completeEndedCompanions', () => {
    it('should close companion posts when end date is past', async () => {
      const now = new Date();
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Test Companion Post',
          business_status: 'open',
          end_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      ];

      mockPrismaService.companion_posts.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.companion_requests.updateMany.mockResolvedValue({
        count: 1,
      });

      await service.completeEndedCompanions();

      expect(mockPrismaService.companion_posts.updateMany).toHaveBeenCalledWith(
        {
          where: { id: { in: ['post-1'] } },
          data: { business_status: 'closed' },
        },
      );

      expect(
        mockPrismaService.companion_requests.updateMany,
      ).toHaveBeenCalledWith({
        where: {
          post_id: { in: ['post-1'] },
          status: 'pending',
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({
          status: 'rejected',
        }),
      });
    });
  });
});
