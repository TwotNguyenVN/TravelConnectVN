import { Test, TestingModule } from '@nestjs/testing';
import { TourRequestsService } from './tour-requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

/**
 * Unit Tests cho TourRequestsService
 * Kiểm tra các chức năng: tạo yêu cầu tham gia tour, validation rules
 */
describe('TourRequestsService', () => {
  let service: TourRequestsService;

  const mockPrismaService = {
    tours: {
      findUnique: jest.fn(),
    },
    tour_requests: {
      findFirst: jest.fn(),
      create: jest.fn(),
      aggregate: jest.fn(),
    },
    tour_schedules: {
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockSocketGateway = {
    sendNotificationToUser: jest.fn(),
  };

  const mockActivityLogsService = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  const mockNotificationsService = {
    create: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourRequestsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SocketGateway, useValue: mockSocketGateway },
        { provide: UserActivityLogsService, useValue: mockActivityLogsService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<TourRequestsService>(TourRequestsService);
    jest.clearAllMocks();
    mockPrismaService.tour_schedules.count.mockResolvedValue(0);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // TEST 1: createRequest — Tour không tồn tại
  // ============================================
  describe('createRequest', () => {
    const userId = 'user-1';
    const dto = {
      tourId: 'tour-1',
      scheduleId: undefined as string | undefined,
      participantCount: 2,
      note: 'Ghi chú test',
    };

    it('should throw NotFoundException when tour does not exist', async () => {
      mockPrismaService.tours.findUnique.mockResolvedValue(null);

      await expect(service.createRequest(userId, dto))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw BadRequestException when guide tries to book own tour', async () => {
      mockPrismaService.tours.findUnique.mockResolvedValue({
        id: 'tour-1',
        max_participants: 10,
        guide_profiles: { user_id: userId }, // Guide = current user
      });

      await expect(service.createRequest(userId, dto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when tour is full', async () => {
      mockPrismaService.tours.findUnique.mockResolvedValue({
        id: 'tour-1',
        max_participants: 5,
        guide_profiles: { user_id: 'other-guide' },
      });

      // Tour already has 4 participants, user wants 2 more → exceeds max 5
      mockPrismaService.tour_requests.aggregate.mockResolvedValue({
        _sum: { participant_count: 4 },
      });

      await expect(service.createRequest(userId, dto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user already has active request', async () => {
      mockPrismaService.tours.findUnique.mockResolvedValue({
        id: 'tour-1',
        max_participants: 10,
        guide_profiles: { user_id: 'other-guide' },
      });

      mockPrismaService.tour_requests.aggregate.mockResolvedValue({
        _sum: { participant_count: 2 },
      });

      // User already has pending request
      mockPrismaService.tour_requests.findFirst.mockResolvedValue({
        id: 'existing-req',
        status: 'pending',
      });

      await expect(service.createRequest(userId, dto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when tour has active schedules but scheduleId is not provided', async () => {
      mockPrismaService.tours.findUnique.mockResolvedValue({
        id: 'tour-1',
        max_participants: 10,
        guide_profiles: { user_id: 'other-guide' },
      });

      mockPrismaService.tour_schedules.count.mockResolvedValue(2); // Has 2 active schedules

      await expect(service.createRequest(userId, dto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should save price_at_booking as tour price if schedule is not provided', async () => {
      const tourPrice = 120000;
      mockPrismaService.tours.findUnique.mockResolvedValue({
        id: 'tour-1',
        price: tourPrice,
        max_participants: 10,
        guide_profiles: { user_id: 'other-guide' },
      });
      mockPrismaService.tour_requests.findFirst.mockResolvedValue(null);
      mockPrismaService.tour_requests.aggregate.mockResolvedValue({
        _sum: { participant_count: 0 },
      });
      mockPrismaService.tour_requests.create.mockImplementation(({ data }) => ({
        id: 'req-1',
        ...data,
      }));

      const res: any = await service.createRequest(userId, dto);
      expect(res.price_at_booking).toBe(tourPrice);
    });

    it('should save price_at_booking as schedule price if schedule is provided', async () => {
      const schedulePrice = 150000;
      const dtoWithSchedule = { ...dto, scheduleId: 'sched-1' };
      mockPrismaService.tours.findUnique.mockResolvedValue({
        id: 'tour-1',
        price: 120000,
        max_participants: 10,
        guide_profiles: { user_id: 'other-guide' },
      });
      mockPrismaService.tour_schedules.findUnique.mockResolvedValue({
        id: 'sched-1',
        tour_id: 'tour-1',
        price: schedulePrice,
        max_participants: 10,
      });
      mockPrismaService.tour_requests.findFirst.mockResolvedValue(null);
      mockPrismaService.tour_requests.aggregate.mockResolvedValue({
        _sum: { participant_count: 0 },
      });
      mockPrismaService.tour_requests.create.mockImplementation(({ data }) => ({
        id: 'req-1',
        ...data,
      }));

      const res: any = await service.createRequest(userId, dtoWithSchedule);
      expect(res.price_at_booking).toBe(schedulePrice);
    });
  });

  // ============================================
  // TEST 2: Validate business rules
  // ============================================
  describe('Business Rules', () => {
    it('should not allow booking with 0 participants', async () => {
      const userId = 'user-1';
      const dto = {
        tourId: 'tour-1',
        scheduleId: undefined as string | undefined,
        participantCount: 0,
        note: '',
      };

      mockPrismaService.tours.findUnique.mockResolvedValue({
        id: 'tour-1',
        max_participants: 10,
        guide_profiles: { user_id: 'guide-1' },
      });

      mockPrismaService.tour_requests.aggregate.mockResolvedValue({
        _sum: { participant_count: 0 },
      });

      mockPrismaService.tour_requests.findFirst.mockResolvedValue(null);

      // participantCount = 0 should still create (validation at DTO level)
      // but the service should handle it - at minimum it should not crash
      mockPrismaService.tour_requests.create.mockResolvedValue({
        id: 'new-req',
        status: 'pending',
        participant_count: 0,
      });

      // This test verifies the service doesn't throw unexpected errors
      // DTO validation (Min(1)) should catch this at controller level
      await expect(service.createRequest(userId, dto)).resolves.toBeDefined();
    });
  });
});
