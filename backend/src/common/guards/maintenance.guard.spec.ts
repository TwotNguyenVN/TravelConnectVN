import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceGuard } from './maintenance.guard';
import { SystemSettingsService } from '../../system-settings/system-settings.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ExecutionContext, ServiceUnavailableException } from '@nestjs/common';

describe('MaintenanceGuard', () => {
  let guard: MaintenanceGuard;

  const mockSettingsService = {
    getPublicSettings: jest.fn(),
  };

  const mockSupabaseService = {
    verifyUser: jest.fn(),
  };

  const mockPrismaService = {
    user_roles: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceGuard,
        { provide: SystemSettingsService, useValue: mockSettingsService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    guard = module.get<MaintenanceGuard>(MaintenanceGuard);

    jest.clearAllMocks();
  });

  const createMockContext = (
    method: string,
    url: string,
    authorization?: string,
  ): ExecutionContext => {
    const request = {
      method,
      url,
      headers: {
        authorization,
      },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow GET requests regardless of maintenance mode', async () => {
    const context = createMockContext('GET', '/tours');
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockSettingsService.getPublicSettings).not.toHaveBeenCalled();
  });

  it('should always allow system-settings path even during maintenance', async () => {
    const context = createMockContext('POST', '/system-settings/maintenance');
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow write requests when maintenance mode is disabled', async () => {
    mockSettingsService.getPublicSettings.mockResolvedValue({
      maintenanceMode: false,
      maintenanceMessage: 'Maintenance message',
    });

    const context = createMockContext('POST', '/tours');
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockSettingsService.getPublicSettings).toHaveBeenCalled();
  });

  it('should throw ServiceUnavailableException when maintenance mode is active and user is guest', async () => {
    mockSettingsService.getPublicSettings.mockResolvedValue({
      maintenanceMode: true,
      maintenanceMessage: 'Hệ thống bảo trì',
    });

    const context = createMockContext('POST', '/tours');
    await expect(guard.canActivate(context)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should throw ServiceUnavailableException when maintenance mode is active and user is not admin', async () => {
    mockSettingsService.getPublicSettings.mockResolvedValue({
      maintenanceMode: true,
      maintenanceMessage: 'Hệ thống bảo trì',
    });
    mockSupabaseService.verifyUser.mockResolvedValue({ id: 'user-1' });
    mockPrismaService.user_roles.findMany.mockResolvedValue([
      { role_code: 'USER' },
    ]);

    const context = createMockContext('POST', '/tours', 'Bearer valid-token');
    await expect(guard.canActivate(context)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should allow write requests when maintenance mode is active if user is SYSTEM_ADMIN', async () => {
    mockSettingsService.getPublicSettings.mockResolvedValue({
      maintenanceMode: true,
      maintenanceMessage: 'Hệ thống bảo trì',
    });
    mockSupabaseService.verifyUser.mockResolvedValue({ id: 'admin-1' });
    mockPrismaService.user_roles.findMany.mockResolvedValue([
      { role_code: 'USER' },
      { role_code: 'SYSTEM_ADMIN' },
    ]);

    const context = createMockContext('POST', '/tours', 'Bearer admin-token');
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});
