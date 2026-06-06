import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Global guard that blocks write operations (POST/PATCH/DELETE)
 * when maintenance mode is enabled via system_settings, except for admin endpoints.
 */
@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method?.toUpperCase();
    const url: string = request.originalUrl || request.url || '';

    // Always allow GET/HEAD/OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    // Always allow admin endpoints (so admin can toggle maintenance off)
    if (url.startsWith('/admin')) {
      return true;
    }

    // Check system_settings for maintenance mode
    const maintenanceSetting = await this.prisma.system_settings.findUnique({
      where: { key: 'is_maintenance' },
    });

    if (maintenanceSetting && maintenanceSetting.value === 'true') {
      throw new ServiceUnavailableException(
        'Hệ thống đang trong chế độ bảo trì. Vui lòng thử lại sau.',
      );
    }

    return true;
  }
}
