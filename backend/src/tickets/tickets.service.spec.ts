/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';
import { TicketCategory, TicketStatus } from './dto/tickets.dto';
import { NotFoundException } from '@nestjs/common';

describe('TicketsService', () => {
  let service: TicketsService;
  let prisma: PrismaService;

  const mockPrisma = {
    support_tickets: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    admin_activity_logs: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create a pending support ticket', async () => {
      const dto = {
        title: 'Lỗi',
        description: 'Chi tiết lỗi',
        category: TicketCategory.PAYMENT,
      };
      mockPrisma.support_tickets.create.mockResolvedValue({
        id: 'ticket-1',
        ...dto,
        status: 'pending',
      });

      const result = await service.createTicket('user-1', dto);

      expect(result).toBeDefined();
      expect(mockPrisma.support_tickets.create).toHaveBeenCalled();
      expect(result.id).toBe('ticket-1');
    });
  });

  describe('getTickets', () => {
    it('should retrieve filtered list of support tickets', async () => {
      mockPrisma.support_tickets.count.mockResolvedValue(1);
      mockPrisma.support_tickets.findMany.mockResolvedValue([
        { id: 'ticket-1', status: 'pending' },
      ]);

      const result = await service.getTickets({ status: 'pending' });

      expect(result).toBeDefined();
      expect(result.total).toBe(1);
      expect(result.data.length).toBe(1);
      expect(mockPrisma.support_tickets.findMany).toHaveBeenCalled();
    });
  });

  describe('updateTicket', () => {
    it('should throw NotFoundException if ticket does not exist', async () => {
      mockPrisma.support_tickets.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTicket('invalid-id', 'admin-1', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update status/assignee and log activity', async () => {
      mockPrisma.support_tickets.findUnique.mockResolvedValue({
        id: 'ticket-1',
        status: 'pending',
        assigned_to_user_id: null,
      });
      mockPrisma.support_tickets.update.mockResolvedValue({
        id: 'ticket-1',
        status: 'processing',
        assigned_to_user_id: 'admin-1',
      });

      const result = await service.updateTicket('ticket-1', 'admin-1', {
        status: TicketStatus.PROCESSING,
        assignedToUserId: 'admin-1',
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.support_tickets.update).toHaveBeenCalled();
      expect(mockPrisma.admin_activity_logs.create).toHaveBeenCalled();
    });
  });
});
