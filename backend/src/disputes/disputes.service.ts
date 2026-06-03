import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResolveDisputeDto } from './dto/disputes.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDispute(tourRequestId: string, raisedByUserId: string, reason: string) {
    const tourRequest = await this.prisma.tour_requests.findUnique({
      where: { id: tourRequestId },
      include: { tours: true },
    });

    if (!tourRequest) {
      throw new NotFoundException(`Không tìm thấy booking đặt tour với mã: ${tourRequestId}`);
    }

    if (tourRequest.status === 'disputed') {
      throw new BadRequestException('Booking đặt tour này đã ở trong trạng thái tranh chấp.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Cập nhật trạng thái booking đặt tour sang disputed
      await tx.tour_requests.update({
        where: { id: tourRequestId },
        data: { status: 'disputed' },
      });

      // Tạo bản ghi tranh chấp mới
      const dispute = await tx.tour_disputes.create({
        data: {
          tour_request_id: tourRequestId,
          raised_by_user_id: raisedByUserId,
          reason,
          status: 'open',
        },
      });

      return dispute;
    });
  }

  async getDisputes() {
    return this.prisma.tour_disputes.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        tour_requests: {
          include: {
            tours: {
              select: {
                id: true,
                title: true,
                price: true,
                guide_profiles: {
                  include: {
                    users: {
                      select: {
                        id: true,
                        full_name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            users_tour_requests_user_idTousers: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
        raised_by: {
          select: {
            full_name: true,
            email: true,
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

  async getDisputeChatHistory(disputeId: string) {
    const dispute = await this.prisma.tour_disputes.findUnique({
      where: { id: disputeId },
      include: {
        tour_requests: {
          include: {
            tours: true,
          },
        },
      },
    });

    if (!dispute) {
      throw new NotFoundException(`Không tìm thấy tranh chấp với mã: ${disputeId}`);
    }

    const tourId = dispute.tour_requests.tour_id;
    const tourGuideId = dispute.tour_requests.tours.guide_profile_id;
    
    // Tìm profile của hướng dẫn viên để lấy user_id
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { id: tourGuideId },
    });
    
    const guideUserId = guideProfile?.user_id;
    const customerUserId = dispute.tour_requests.user_id;

    // Tìm cuộc hội thoại liên quan đến tour này
    let conversation = await this.prisma.conversations.findFirst({
      where: {
        related_tour_id: tourId,
      },
    });

    // Nếu không có cuộc hội thoại gắn với tour, tìm cuộc hội thoại 1-1 giữa khách và HDV
    if (!conversation && guideUserId) {
      conversation = await this.prisma.conversations.findFirst({
        where: {
          conversation_type: 'direct',
          conversation_participants: {
            every: {
              user_id: { in: [customerUserId, guideUserId] },
            },
          },
        },
      });
    }

    if (!conversation) {
      return [];
    }

    // Lấy tất cả tin nhắn trong cuộc hội thoại
    return this.prisma.messages.findMany({
      where: {
        conversation_id: conversation.id,
        deleted_at: null,
      },
      orderBy: { sent_at: 'asc' },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
          },
        },
      },
    });
  }

  async resolveDispute(id: string, resolvedByUserId: string, dto: ResolveDisputeDto) {
    const dispute = await this.prisma.tour_disputes.findUnique({
      where: { id },
      include: { tour_requests: true },
    });

    if (!dispute) {
      throw new NotFoundException(`Không tìm thấy tranh chấp với mã: ${id}`);
    }

    if (dispute.status === 'resolved') {
      throw new BadRequestException('Tranh chấp này đã được giải quyết từ trước.');
    }

    const refundAmount = dto.refundAmount || 0;

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái tranh chấp sang resolved
      const updatedDispute = await tx.tour_disputes.update({
        where: { id },
        data: {
          status: 'resolved',
          resolution_note: dto.resolutionNote,
          refund_amount: refundAmount,
          resolved_by_user_id: resolvedByUserId,
          resolved_at: new Date(),
        },
      });

      // 2. Cập nhật trạng thái booking đặt tour tương ứng
      const requestStatus = refundAmount > 0 ? 'cancelled' : 'completed';
      await tx.tour_requests.update({
        where: { id: dispute.tour_request_id },
        data: {
          status: requestStatus,
          response_note: `Tranh chấp đã được xử lý bởi hỗ trợ hệ thống. Phán quyết: ${dto.resolutionNote}`,
        },
      });

      // 3. Xử lý giao dịch thanh toán liên quan
      if (refundAmount > 0) {
        const successTx = await tx.payment_transactions.findFirst({
          where: {
            tour_request_id: dispute.tour_request_id,
            status: 'paid',
          },
        });

        if (successTx) {
          await tx.payment_transactions.update({
            where: { id: successTx.id },
            data: { status: 'refunded' },
          });
        }
      }

      // 4. Ghi audit log
      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: resolvedByUserId,
          actor_role_code: 'SUPPORT_STAFF',
          module_name: 'disputes',
          entity_type: 'tour_disputes',
          entity_pk: id,
          action_type: 'resolve_dispute',
          reason: `Phán quyết tranh chấp đặt tour. Nội dung: ${dto.resolutionNote}. Số tiền hoàn trả: ${refundAmount.toLocaleString('vi-VN')} VND`,
          new_data: {
            status: 'resolved',
            resolution_note: dto.resolutionNote,
            refund_amount: refundAmount,
            tour_request_status: requestStatus,
          } as Prisma.InputJsonValue,
        },
      });

      return updatedDispute;
    });

    return {
      success: true,
      message: 'Giải quyết tranh chấp đặt tour thành công',
      data: result,
    };
  }
}
