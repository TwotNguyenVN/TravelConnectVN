import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class SupportService {
  private aiClient: GoogleGenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {
    const apiKey =
      this.configService.get<string>('GEMINI_API_KEY') ||
      process.env.GEMINI_API_KEY ||
      '';
    this.aiClient = new GoogleGenAI({ apiKey });
  }

  // =====================
  // TICKETS
  // =====================
  async getTickets() {
    return this.prisma.support_tickets.findMany({
      include: {
        reporter: {
          select: {
            email: true,
            full_name: true,
            user_roles_user_roles_user_idTousers: {
              select: { role_code: true },
            },
          },
        },
        assignee: { select: { email: true, full_name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateTicket(
    id: string,
    data: { status?: string; assigned_to_user_id?: string },
  ) {
    return this.prisma.support_tickets.update({
      where: { id },
      data,
    });
  }

  // =====================
  // DISPUTES
  // =====================
  async getDisputes() {
    return this.prisma.tour_disputes.findMany({
      include: {
        tour_requests: true,
        raised_by: {
          select: {
            email: true,
            full_name: true,
            user_roles_user_roles_user_idTousers: {
              select: { role_code: true },
            },
          },
        },
        resolved_by: { select: { email: true, full_name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async resolveDispute(
    id: string,
    data: {
      resolutionNote: string;
      refundAmount: number;
      resolvedByUserId: string;
    },
  ) {
    const dispute = await this.prisma.tour_disputes.findUnique({
      where: { id },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');

    const updated = await this.prisma.tour_disputes.update({
      where: { id },
      data: {
        status: 'resolved',
        resolution_note: data.resolutionNote,
        refund_amount: data.refundAmount,
        resolved_by_user_id: data.resolvedByUserId,
        resolved_at: new Date(),
      },
    });

    // Send notification to the user who raised the dispute
    await this.notificationsService.create({
      user_id: dispute.raised_by_user_id,
      title: 'Tranh chấp đã được giải quyết',
      content: `Tranh chấp của bạn đã được hỗ trợ viên giải quyết. ${data.refundAmount > 0 ? `Số tiền hoàn dự kiến: ${data.refundAmount}` : ''}`,
      type: 'dispute_resolved',
      entity_id: id,
      entity_type: 'dispute',
    });

    return updated;
  }

  // =====================
  // NOTIFICATIONS BROADCAST
  // =====================
  async broadcastNotification(data: {
    title: string;
    content: string;
    targetGroup: string;
  }) {
    let whereClause: import('@prisma/client').Prisma.public_usersWhereInput =
      {};
    if (data.targetGroup === 'GUIDES') {
      whereClause = {
        user_roles_user_roles_user_idTousers: { some: { role_code: 'GUIDE' } },
      };
    } else if (data.targetGroup === 'USERS') {
      whereClause = {
        user_roles_user_roles_user_idTousers: { some: { role_code: 'USER' } },
      };
    }

    const users = await this.prisma.public_users.findMany({
      where: whereClause,
      select: { id: true },
    });

    const notifications = users.map((user) => ({
      user_id: user.id,
      title: data.title,
      content: data.content,
      notification_type: 'broadcast',
      entity_type: 'broadcast',
    }));

    if (notifications.length > 0) {
      await this.prisma.notifications.createMany({
        data: notifications,
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
      orderBy: { created_at: 'desc' },
    });
  }

  async createFaqItem(data: {
    question: string;
    answer: string;
    category?: string;
    createdBy?: string;
  }) {
    return this.prisma.faq_items.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        created_by: data.createdBy,
      },
    });
  }

  async updateFaqItem(
    id: string,
    data: { question?: string; answer?: string; category?: string },
  ) {
    return this.prisma.faq_items.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }

  async deleteFaqItem(id: string) {
    return this.prisma.faq_items.delete({
      where: { id },
    });
  }

  // =====================
  // CSAT & SLA ANALYTICS
  // =====================
  async getCsatAnalytics() {
    // 1. Total resolved in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [ticketsResolved, disputesResolved] = await Promise.all([
      this.prisma.support_tickets.count({
        where: { status: 'closed', updated_at: { gte: thirtyDaysAgo } },
      }),
      this.prisma.tour_disputes.count({
        where: { status: 'resolved', resolved_at: { gte: thirtyDaysAgo } },
      }),
    ]);

    // 2. Average Resolution Hours (mocked for now, normally calculated using resolved_at - created_at)
    // We will do a basic average: query all resolved disputes and tickets, calc avg diff.
    const resolvedDisputes = await this.prisma.tour_disputes.findMany({
      where: { status: 'resolved', resolved_at: { not: null } },
      select: {
        created_at: true,
        resolved_at: true,
        resolved_by: { select: { id: true, full_name: true } },
      },
    });

    let totalDiffMs = 0;
    const staffStats: Record<
      string,
      { count: number; totalMs: number; name: string }
    > = {};

    resolvedDisputes.forEach((d) => {
      if (d.resolved_at && d.resolved_by) {
        const diff = d.resolved_at.getTime() - d.created_at.getTime();
        totalDiffMs += diff;
        const staffId = d.resolved_by.id;
        if (!staffStats[staffId]) {
          staffStats[staffId] = {
            count: 0,
            totalMs: 0,
            name: d.resolved_by.full_name || 'Staff',
          };
        }
        staffStats[staffId].count++;
        staffStats[staffId].totalMs += diff;
      }
    });

    const avgResolutionHours =
      resolvedDisputes.length > 0
        ? Math.round(totalDiffMs / resolvedDisputes.length / (1000 * 60 * 60))
        : 0;

    const staffLeaderboard = Object.entries(staffStats)
      .map(([staffId, stat]) => ({
        staffId,
        name: stat.name,
        ticketsResolved: stat.count,
        avgResolutionHours: Math.round(
          stat.totalMs / stat.count / (1000 * 60 * 60),
        ),
      }))
      .sort((a, b) => b.ticketsResolved - a.ticketsResolved)
      .slice(0, 5);

    // 3. Weekly Trend (mocked data for the UI)
    const weeklyTrend = [
      { week: 'Tuần 1', count: 12 },
      { week: 'Tuần 2', count: 18 },
      { week: 'Tuần 3', count: 15 },
      { week: 'Tuần 4', count: ticketsResolved + disputesResolved },
    ];

    return {
      summary: {
        totalTicketsResolved: ticketsResolved,
        totalDisputesResolved: disputesResolved,
        avgResolutionHours,
      },
      staffLeaderboard,
      weeklyTrend,
    };
  }

  // =====================
  // AGENT CO-PILOT
  // =====================
  async getCopilotSuggestion(text: string) {
    try {
      const prompt = `Bạn là Trợ lý AI (Agent Co-Pilot) hỗ trợ nhân viên CSKH của hệ thống du lịch TravelConnect.
Nhiệm vụ của bạn là đọc nội dung khiếu nại hoặc câu hỏi của khách hàng, và sinh ra một câu trả lời ngắn gọn, chuyên nghiệp, lịch sự để gợi ý cho nhân viên copy gửi cho khách.
Vui lòng xưng hô "chúng tôi" với khách hàng, luôn thể hiện sự đồng cảm và trấn an.
Nội dung khiếu nại của khách: "${text}"
`;
      const response = await this.aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return { suggestion: response.text };
    } catch (error) {
      console.error('Co-Pilot Error:', error);
      return {
        suggestion:
          'Xin lỗi, hiện tại tính năng gợi ý AI đang bảo trì. Bạn vui lòng trả lời thủ công nhé.',
      };
    }
  }
}
