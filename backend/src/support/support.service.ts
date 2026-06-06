import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // =====================
  // TICKETS
  // =====================
  async getTickets(params?: Record<string, unknown>) {
    return this.prisma.support_tickets.findMany({
      include: {
        reporter: { select: { email: true, full_name: true, user_roles_user_roles_user_idTousers: { select: { role_code: true } } } },
        assignee: { select: { email: true, full_name: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async updateTicket(id: string, data: { status?: string; assigned_to_user_id?: string }) {
    return this.prisma.support_tickets.update({
      where: { id },
      data
    });
  }

  // =====================
  // DISPUTES
  // =====================
  async getDisputes(params?: Record<string, unknown>) {
    return this.prisma.tour_disputes.findMany({
      include: {
        tour_requests: true,
        raised_by: { select: { email: true, full_name: true, user_roles_user_roles_user_idTousers: { select: { role_code: true } } } },
        resolved_by: { select: { email: true, full_name: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async resolveDispute(id: string, data: { resolutionNote: string; refundAmount: number; resolvedByUserId: string }) {
    const dispute = await this.prisma.tour_disputes.findUnique({ where: { id } });
    if (!dispute) throw new NotFoundException('Dispute not found');

    const updated = await this.prisma.tour_disputes.update({
      where: { id },
      data: {
        status: 'resolved',
        resolution_note: data.resolutionNote,
        refund_amount: data.refundAmount,
        resolved_by_user_id: data.resolvedByUserId,
        resolved_at: new Date()
      }
    });

    // Send notification to the user who raised the dispute
    await this.notificationsService.create({
      user_id: dispute.raised_by_user_id,
      title: 'Tranh chấp đã được giải quyết',
      content: `Tranh chấp của bạn đã được hỗ trợ viên giải quyết. ${data.refundAmount > 0 ? `Số tiền hoàn dự kiến: ${data.refundAmount}` : ''}`,
      type: 'dispute_resolved',
      entity_id: id,
      entity_type: 'dispute'
    });

    return updated;
  }

  // =====================
  // NOTIFICATIONS BROADCAST
  // =====================
  async broadcastNotification(data: { title: string; content: string; targetGroup: string }) {
    // targetGroup: 'ALL', 'GUIDES', 'USERS'
    let whereClause: any = {};
    if (data.targetGroup === 'GUIDES') {
      whereClause = { user_roles_user_roles_user_idTousers: { some: { role_code: 'GUIDE' } } };
    } else if (data.targetGroup === 'USERS') {
      whereClause = { user_roles_user_roles_user_idTousers: { some: { role_code: 'USER' } } };
    }

    const users = await this.prisma.public_users.findMany({
      where: whereClause,
      select: { id: true }
    });

    const notifications = users.map(user => ({
      user_id: user.id,
      title: data.title,
      content: data.content,
      notification_type: 'broadcast',
      entity_type: 'broadcast'
    }));

    if (notifications.length > 0) {
      await this.prisma.notifications.createMany({
        data: notifications
      });
      // Optionally emit sockets for real-time (not doing bulk emit to avoid overload)
    }

    return { success: true, count: notifications.length };
  }

  // =====================
  // FAQ
  // =====================
  async getFaqItems() {
    return this.prisma.faq_items.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async createFaqItem(data: { question: string; answer: string; category?: string; createdBy?: string }) {
    return this.prisma.faq_items.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        created_by: data.createdBy
      }
    });
  }

  async updateFaqItem(id: string, data: { question?: string; answer?: string; category?: string }) {
    return this.prisma.faq_items.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
  }

  async deleteFaqItem(id: string) {
    return this.prisma.faq_items.delete({
      where: { id }
    });
  }
}
