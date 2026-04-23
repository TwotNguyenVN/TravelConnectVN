import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,
  ) {}

  async create(data: { user_id: string; title: string; content: string; type?: string; entity_id?: string; entity_type?: string }) {
    const notification = await this.prisma.notifications.create({
      data: {
        user_id: data.user_id,
        title: data.title,
        content: data.content,
        notification_type: data.type || 'system',
        entity_id: data.entity_id,
        entity_type: data.entity_type,
      },
    });


    // Gửi socket real-time
    this.socketGateway.sendToUser(data.user_id, 'new_notification', {
      ...notification,
      message: data.title // For toast compatibility
    });

    return notification;
  }


  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.prisma.notifications.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.notifications.count({
        where: { user_id: userId },
      }),
    ]);

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notifications.updateMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notifications.updateMany({
      where: {
        user_id: userId,
        is_read: false,
      },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notifications.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
    return { count };
  }

  async delete(userId: string, notificationId: string) {

    return this.prisma.notifications.deleteMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });
  }
}
