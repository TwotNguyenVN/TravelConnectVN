import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSosDto } from './dto/create-sos.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SosService {
  constructor(private readonly prisma: PrismaService) {}

  async createSos(userId: string, dto: CreateSosDto) {
    return this.prisma.sos_alerts.create({
      data: {
        user_id: userId,
        tour_id: dto.tourId || null,
        latitude: dto.latitude,
        longitude: dto.longitude,
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
  }

  async getSosAlerts() {
    return this.prisma.sos_alerts.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
            phone: true,
          },
        },
        tours: {
          select: {
            title: true,
            province: true,
          },
        },
        resolved_by: {
          select: {
            full_name: true,
          },
        },
      },
    });
  }

  async resolveSos(id: string, resolvedByUserId: string, note: string) {
    const alert = await this.prisma.sos_alerts.findUnique({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException(`Không tìm thấy tín hiệu SOS với mã: ${id}`);
    }

    const updatedAlert = await this.prisma.$transaction(async (tx) => {
      const res = await tx.sos_alerts.update({
        where: { id },
        data: {
          status: 'resolved',
          note,
          resolved_by_user_id: resolvedByUserId,
          resolved_at: new Date(),
        },
      });

      // Ghi audit log
      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: resolvedByUserId,
          actor_role_code: 'SUPPORT_STAFF',
          module_name: 'sos',
          entity_type: 'sos_alerts',
          entity_pk: id,
          action_type: 'resolve_sos',
          reason: `Đã xử lý tín hiệu khẩn cấp SOS từ người dùng. Ghi chú: ${note}`,
          new_data: { note, status: 'resolved' } as Prisma.InputJsonValue,
        },
      });

      return res;
    });

    return {
      success: true,
      message: 'Đã giải quyết cảnh báo SOS thành công',
      data: updatedAlert,
    };
  }
}
