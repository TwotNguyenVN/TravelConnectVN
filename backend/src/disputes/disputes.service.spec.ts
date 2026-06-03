/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { DisputesService } from './disputes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('DisputesService', () => {
  let service: DisputesService;

  const mockPrisma = {
    tour_requests: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    tour_disputes: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    guide_profiles: {
      findUnique: jest.fn(),
    },
    conversations: {
      findFirst: jest.fn(),
    },
    messages: {
      findMany: jest.fn(),
    },
    payment_transactions: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    admin_activity_logs: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisputesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DisputesService>(DisputesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDispute', () => {
    it('should throw NotFoundException if tour request is missing', async () => {
      mockPrisma.tour_requests.findUnique.mockResolvedValue(null);

      await expect(
        service.createDispute('invalid-id', 'user-1', 'Reason'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should open dispute and update request status to disputed', async () => {
      mockPrisma.tour_requests.findUnique.mockResolvedValue({
        id: 'req-1',
        status: 'approved',
        tour_id: 'tour-1',
      });
      mockPrisma.tour_disputes.create.mockResolvedValue({
        id: 'dispute-1',
        tour_request_id: 'req-1',
      });

      const result = await service.createDispute(
        'req-1',
        'user-1',
        'Hủy tour không báo trước',
      );

      expect(result).toBeDefined();
      expect(mockPrisma.tour_requests.update).toHaveBeenCalled();
      expect(mockPrisma.tour_disputes.create).toHaveBeenCalled();
    });
  });

  describe('getDisputeChatHistory', () => {
    it('should throw NotFoundException if dispute does not exist', async () => {
      mockPrisma.tour_disputes.findUnique.mockResolvedValue(null);

      await expect(service.getDisputeChatHistory('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should retrieve message list for matching conversation', async () => {
      mockPrisma.tour_disputes.findUnique.mockResolvedValue({
        id: 'dispute-1',
        tour_requests: {
          tour_id: 'tour-1',
          user_id: 'cust-1',
          tours: { guide_profile_id: 'guide-p-1' },
        },
      });
      mockPrisma.guide_profiles.findUnique.mockResolvedValue({
        user_id: 'guide-1',
      });
      mockPrisma.conversations.findFirst.mockResolvedValue({ id: 'conv-1' });
      mockPrisma.messages.findMany.mockResolvedValue([
        { id: 'msg-1', content: 'Halo' },
      ]);

      const result = await service.getDisputeChatHistory('dispute-1');

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(mockPrisma.messages.findMany).toHaveBeenCalled();
    });
  });

  describe('resolveDispute', () => {
    it('should resolve dispute, update request status and trigger refunds when applicable', async () => {
      mockPrisma.tour_disputes.findUnique.mockResolvedValue({
        id: 'dispute-1',
        status: 'open',
        tour_request_id: 'req-1',
      });
      mockPrisma.tour_disputes.update.mockResolvedValue({
        id: 'dispute-1',
        status: 'resolved',
      });
      mockPrisma.payment_transactions.findFirst.mockResolvedValue({
        id: 'tx-1',
        status: 'paid',
      });

      const result = await service.resolveDispute('dispute-1', 'admin-1', {
        resolutionNote: 'Hoàn tiền 100% cho khách',
        refundAmount: 500000,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.tour_disputes.update).toHaveBeenCalled();
      expect(mockPrisma.tour_requests.update).toHaveBeenCalled();
      expect(mockPrisma.payment_transactions.update).toHaveBeenCalled();
      expect(mockPrisma.admin_activity_logs.create).toHaveBeenCalled();
    });
  });
});
