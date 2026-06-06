/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';

import { SystemSettingsService } from '../../system-settings/system-settings.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private readonly systemSettingsService: SystemSettingsService,
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Chỉ chặn các request ghi (POST, PUT, PATCH, DELETE)
    const isWriteRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    if (!isWriteRequest) {
      return true;
    }

    // Ngoại lệ: Không bao giờ chặn việc cập nhật cấu hình hệ thống
    const url = request.url;
    if (url.includes('/system-settings')) {
      return true;
    }

    // Lấy trạng thái bảo trì
    const { maintenanceMode, maintenanceMessage } =
      await this.systemSettingsService.getPublicSettings();

    if (!maintenanceMode) {
      return true;
    }

    // Nếu đang bảo trì, kiểm tra xem người dùng có phải là SYSTEM_ADMIN không
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const user = await this.supabaseService.verifyUser(token);
        const userRoles = await this.prisma.user_roles.findMany({
          where: { user_id: user.id },
          select: { role_code: true },
        });

        const roles = userRoles.map((r) => r.role_code);

        // Nếu là Admin, cho phép đi qua
        if (roles.includes('SYSTEM_ADMIN')) {
          // Gắn user vào request để các guard tiếp theo không cần giải mã lại
          request.user = {
            ...user,
            roles,
          };
          return true;
        }
      } catch {
        // Lỗi giải mã token hoặc truy vấn DB sẽ do AuthGuard xử lý sau
      }
    }

    // Nếu hệ thống đang bảo trì và không phải Admin, chặn lại và trả về 503
    throw new ServiceUnavailableException(
      maintenanceMessage || 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
    );
  }
}
