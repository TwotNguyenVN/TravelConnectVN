/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { SosService } from './sos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SosService', () => {
  let service: SosService;
  let prisma: PrismaService;

  const mockPrisma = {
    sos_alerts: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    admin_activity_logs: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SosService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<SosService>(SosService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSos', () => {
    it('should create an active SOS alert', async () => {
      const dto = { latitude: 10.5, longitude: 20.6, tourId: 'tour-1' };
      mockPrisma.sos_alerts.create.mockResolvedValue({
        id: 'sos-1',
        ...dto,
        status: 'active',
      });

      const result = await service.createSos('user-1', dto);

      expect(result).toBeDefined();
      expect(mockPrisma.sos_alerts.create).toHaveBeenCalledWith({
        data: {
          user_id: 'user-1',
          tour_id: 'tour-1',
          latitude: 10.5,
          longitude: 20.6,
          status: 'active',
        },
        include: {
          users: {
            select: {
              full_name: true,
              email: true,
              phone: true,
              avatar_url: true,
            },
          },
        },
      });
      expect(result.id).toBe('sos-1');
    });
  });

  describe('getSosAlerts', () => {
    it('should retrieve list of SOS alerts sorted by created_at', async () => {
      mockPrisma.sos_alerts.findMany.mockResolvedValue([
        { id: 'sos-1', status: 'active' },
      ]);

      const result = await service.getSosAlerts();

      expect(result).toBeDefined();
      expect(mockPrisma.sos_alerts.findMany).toHaveBeenCalled();
      expect(result.length).toBe(1);
    });
  });

  describe('resolveSos', () => {
    it('should throw NotFoundException if SOS alert does not exist', async () => {
      mockPrisma.sos_alerts.findUnique.mockResolvedValue(null);

      await expect(
        service.resolveSos('invalid-id', 'admin-1', 'Done'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should resolve the SOS alert and log the action', async () => {
      mockPrisma.sos_alerts.findUnique.mockResolvedValue({
        id: 'sos-1',
        status: 'active',
      });
      mockPrisma.sos_alerts.update.mockResolvedValue({
        id: 'sos-1',
        status: 'resolved',
      });

      const result = await service.resolveSos('sos-1', 'admin-1', 'Rescued');

      expect(result.success).toBe(true);
      expect(mockPrisma.sos_alerts.update).toHaveBeenCalled();
      expect(mockPrisma.admin_activity_logs.create).toHaveBeenCalled();
    });
  });
});
