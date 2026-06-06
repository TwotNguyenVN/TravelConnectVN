/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SystemSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicSettings() {
    const settings = await this.prisma.system_settings.findMany({
      where: {
        key: {
          in: ['maintenance_mode', 'maintenance_message'],
        },
      },
    });

    const mode =
      settings.find((s) => s.key === 'maintenance_mode')?.value === 'true';
    const message =
      settings.find((s) => s.key === 'maintenance_message')?.value || '';

    return {
      maintenanceMode: mode,
      maintenanceMessage: message,
    };
  }

  async getAllSettings() {
    return this.prisma.system_settings.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async getSettingByKey(key: string) {
    const setting = await this.prisma.system_settings.findUnique({
      where: { key },
    });
    if (!setting) {
      throw new NotFoundException(`Không tìm thấy cấu hình với khóa: ${key}`);
    }
    return setting;
  }

  async updateSetting(key: string, value: string, actorUserId: string) {
    const oldSetting = await this.prisma.system_settings.findUnique({
      where: { key },
    });

    if (!oldSetting) {
      throw new NotFoundException(`Không tìm thấy cấu hình với khóa: ${key}`);
    }

    if (key === 'maintenance_mode' && value !== 'true' && value !== 'false') {
      throw new BadRequestException(
        'Giá trị của maintenance_mode phải là "true" hoặc "false"',
      );
    }

    if (key === 'commission_rate') {
      const rate = Number(value);
      if (isNaN(rate) || rate < 0 || rate > 1) {
        throw new BadRequestException(
          'Tỷ lệ hoa hồng commission_rate phải là số thực từ 0 đến 1',
        );
      }
    }

    const updatedSetting = await this.prisma.$transaction(async (tx) => {
      const setting = await tx.system_settings.update({
        where: { key },
        data: { value, updated_at: new Date() },
      });

      // Ghi audit log
      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: actorUserId,
          actor_role_code: 'SYSTEM_ADMIN',
          module_name: 'system_settings',
          entity_type: 'system_settings',
          entity_pk: key,
          action_type: 'update_system_setting',
          reason: `Thay đổi cấu hình ${key} từ "${oldSetting.value}" thành "${value}"`,
          old_data: { value: oldSetting.value } as Prisma.InputJsonValue,
          new_data: { value } as Prisma.InputJsonValue,
        },
      });

      return setting;
    });

    return {
      success: true,
      message: `Cập nhật cấu hình ${key} thành công`,
      data: updatedSetting,
    };
  }
}
