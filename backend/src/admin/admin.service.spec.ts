/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
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
