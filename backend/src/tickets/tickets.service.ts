import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/tickets.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(reporterUserId: string, dto: CreateTicketDto) {
    return this.prisma.support_tickets.create({
      data: {
        reporter_user_id: reporterUserId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        status: 'pending',
      },
      include: {
        reporter: {
          select: {
            full_name: true,
            email: true,
          },
        },
      },
    });
  }

  async getTickets(query: {
    skip?: number;
    take?: number;
    status?: string;
    category?: string;
    assignedToUserId?: string;
    search?: string;
  }) {
    const where: Prisma.support_ticketsWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.assignedToUserId) {
      where.assigned_to_user_id = query.assignedToUserId;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.support_tickets.count({ where }),
      this.prisma.support_tickets.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { created_at: 'desc' },
        include: {
          reporter: {
            select: {
              full_name: true,
              email: true,
              phone: true,
            },
          },
          assignee: {
            select: {
              full_name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return { total, data };
  }

  async updateTicket(id: string, actorUserId: string, dto: UpdateTicketDto) {
    const ticket = await this.prisma.support_tickets.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException(`Không tìm thấy ticket hỗ trợ với mã: ${id}`);
    }

    const oldData = {
      status: ticket.status,
      assigned_to_user_id: ticket.assigned_to_user_id,
    };

    const updatedTicket = await this.prisma.$transaction(async (tx) => {
      const res = await tx.support_tickets.update({
        where: { id },
        data: {
          status: dto.status ?? undefined,
          assigned_to_user_id: dto.assignedToUserId ?? undefined,
          updated_at: new Date(),
        },
      });

      // Ghi audit log
      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: actorUserId,
          actor_role_code: 'SUPPORT_STAFF',
          module_name: 'support_tickets',
          entity_type: 'support_tickets',
          entity_pk: id,
          action_type: 'update_ticket',
          reason: `Cập nhật ticket hỗ trợ. Trạng thái cũ: ${ticket.status} -> mới: ${res.status}. Nhân viên phụ trách cũ: ${ticket.assigned_to_user_id} -> mới: ${res.assigned_to_user_id}`,
          old_data: oldData as Prisma.InputJsonValue,
          new_data: {
            status: res.status,
            assigned_to_user_id: res.assigned_to_user_id,
          } as Prisma.InputJsonValue,
        },
      });

      return res;
    });

    return {
      success: true,
      message: 'Cập nhật ticket thành công',
      data: updatedTicket,
    };
  }
}
