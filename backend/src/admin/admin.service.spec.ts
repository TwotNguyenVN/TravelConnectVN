/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn(),
        },
      };
    }),
  };
});

describe('AdminService - analyzeContent', () => {
  let service: AdminService;
  let mockPrisma: any;
  let mockSupabase: any;
  let mockConfig: any;

  beforeEach(async () => {
    mockPrisma = {};
    mockSupabase = {};
    mockConfig = {
      get: jest.fn().mockReturnValue('mock-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should return empty result if text is empty', async () => {
    const result = await service.analyzeContent('');
    expect(result.flagged).toBe(false);
    expect(result.highlights).toHaveLength(0);
  });

  it('should call generateContent and return parsed JSON when successful', async () => {
    const mockResponseText = JSON.stringify({
      flagged: true,
      reason: 'Phát hiện số điện thoại liên hệ',
      highlights: [
        {
          text: '0912345678',
          type: 'contact_info',
          explanation: 'Số điện thoại',
        },
      ],
    });

    const mockGenAIInstance = (service as any).client;
    mockGenAIInstance.models.generateContent.mockResolvedValue({
      text: mockResponseText,
    });

    const result = await service.analyzeContent(
      'Liên hệ tôi qua số 0912345678',
    );
    expect(result.flagged).toBe(true);
    expect(result.highlights).toHaveLength(1);
    expect(result.highlights[0].text).toBe('0912345678');
    expect(mockGenAIInstance.models.generateContent).toHaveBeenCalled();
  });

  it('should fallback to regex parsing if generateContent throws error', async () => {
    const mockGenAIInstance = (service as any).client;
    mockGenAIInstance.models.generateContent.mockRejectedValue(
      new Error('API Failure'),
    );

    const result = await service.analyzeContent(
      'Liên hệ email: test@example.com hoặc số 0912345678',
    );
    expect(result.flagged).toBe(true);
    expect(result.highlights).toHaveLength(2);
    expect(result.highlights[0].text).toBe('0912345678');
    expect(result.highlights[1].text).toBe('test@example.com');
  });
});

describe('AdminService - updateTransactionStatus', () => {
  let service: AdminService;
  let mockPrisma: any;
  let mockSupabase: any;
  let mockConfig: any;

  beforeEach(async () => {
    mockPrisma = {
      payment_transactions: {
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      tour_requests: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      admin_activity_logs: {
        create: jest.fn(),
      },
      $transaction: jest.fn((callback: (tx: any) => Promise<unknown>) =>
        callback(mockPrisma),
      ),
    };
    mockSupabase = {};
    mockConfig = {
      get: jest.fn().mockReturnValue('mock-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should throw NotFoundException if transaction is not found', async () => {
    mockPrisma.payment_transactions.findUnique.mockResolvedValue(null);
    await expect(
      service.updateTransactionStatus('tx-1', 'paid', 'admin-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update status to paid and update tour_request to paid if total amount matched', async () => {
    const mockTx = {
      id: 'tx-1',
      status: 'pending',
      amount: 100000,
      tour_request_id: 'tr-1',
      paid_at: null,
    };
    const mockRequest = {
      id: 'tr-1',
      price_at_booking: 100000,
      participant_count: 1,
      tours: { price: 100000 },
    };

    mockPrisma.payment_transactions.findUnique.mockResolvedValue(mockTx);
    mockPrisma.payment_transactions.update.mockResolvedValue({
      ...mockTx,
      status: 'paid',
    });
    mockPrisma.tour_requests.findUnique.mockResolvedValue(mockRequest);
    mockPrisma.payment_transactions.findMany.mockResolvedValue([
      { id: 'tx-1', amount: 100000, status: 'paid' },
    ]);

    const result = await service.updateTransactionStatus(
      'tx-1',
      'paid',
      'admin-1',
    );
    expect(result.status).toBe('paid');
    expect(mockPrisma.payment_transactions.update).toHaveBeenCalledWith({
      where: { id: 'tx-1' },
      data: expect.objectContaining({ status: 'paid' }),
    });
    expect(mockPrisma.tour_requests.update).toHaveBeenCalledWith({
      where: { id: 'tr-1' },
      data: { status: 'paid' },
    });
    expect(mockPrisma.admin_activity_logs.create).toHaveBeenCalled();
  });
});

describe('AdminService - getSystemHealth', () => {
  let service: AdminService;
  let mockPrisma: any;
  let mockSupabase: any;
  let mockConfig: any;

  beforeEach(async () => {
    mockPrisma = {
      $queryRaw: jest.fn(),
      admin_activity_logs: { count: jest.fn() },
      tour_requests: { count: jest.fn() },
      payment_transactions: { count: jest.fn(), aggregate: jest.fn() },
    };
    mockSupabase = {};
    mockConfig = {
      get: jest.fn().mockReturnValue('mock-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should return healthy status when DB is up', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([1]);

    const result = await service.getSystemHealth();
    expect(result.services.database.status).toBe('healthy');
  });

  it('should return down status when DB is down', async () => {
    mockPrisma.$queryRaw.mockRejectedValue(new Error('Connection error'));

    const result = await service.getSystemHealth();
    expect(result.services.database.status).toBe('down');
  });
});

describe('AdminService - createCategory', () => {
  let service: AdminService;
  let mockPrisma: any;
  let mockSupabase: any;
  let mockConfig: any;

  beforeEach(async () => {
    mockPrisma = {
      tour_categories: { create: jest.fn() },
      admin_activity_logs: { create: jest.fn() },
    };
    mockSupabase = {};
    mockConfig = {
      get: jest.fn().mockReturnValue('mock-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should create category and return mapped bigInt id', async () => {
    mockPrisma.tour_categories.create.mockResolvedValue({
      id: BigInt(1),
      name: 'Adventure',
    });

    const result = await service.createCategory(
      'tour_categories',
      { name: 'Adventure' },
      'admin-1',
    );

    expect(result.id).toBe('1');
    expect((result as any).name).toBe('Adventure');
    expect(mockPrisma.admin_activity_logs.create).toHaveBeenCalled();
  });
});
