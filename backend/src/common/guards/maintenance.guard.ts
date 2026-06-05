import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Singleton service to hold maintenance mode state in-memory.
 * In production, this could be backed by Redis or a database setting.
 */
@Injectable()
export class MaintenanceService {
  private enabled = false;
  private enabledAt: Date | null = null;
  private enabledBy: string | null = null;

  isEnabled(): boolean {
    return this.enabled;
  }

  getStatus() {
    return {
      enabled: this.enabled,
      enabledAt: this.enabledAt,
      enabledBy: this.enabledBy,
    };
  }

  toggle(enabled: boolean, adminId: string) {
    this.enabled = enabled;
    this.enabledAt = enabled ? new Date() : null;
    this.enabledBy = enabled ? adminId : null;
    return this.getStatus();
  }
}

/**
 * Global guard that blocks write operations (POST/PATCH/DELETE)
 * when maintenance mode is enabled, except for admin endpoints.
 */
@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.maintenanceService.isEnabled()) {
      return true;
    }

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

    // Block all other write operations
    throw new ServiceUnavailableException(
      'Hệ thống đang trong chế độ bảo trì. Vui lòng thử lại sau.',
    );
  }
}
