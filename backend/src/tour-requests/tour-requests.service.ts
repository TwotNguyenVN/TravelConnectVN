import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourRequestDto } from './dto/create-tour-request.dto';
import { TourRequestQueryDto } from './dto/tour-request-query.dto';
import {
  UpdateTourRequestStatusDto,
  CancelTourRequestDto,
} from './dto/update-tour-request-status.dto';

import { SocketGateway } from '../socket/socket.gateway';
import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class TourRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketGateway: SocketGateway,
    private readonly activityLogsService: UserActivityLogsService,
    private readonly notificationsService: NotificationsService,
  ) {}



  async createRequest(userId: string, dto: CreateTourRequestDto) {
    const { tourId, scheduleId, participantCount, note } = dto;

    // 1. Kiểm tra tour tồn tại và lấy thông tin guide
    const tour = await this.prisma.tours.findUnique({
      where: { id: tourId },
      include: {
        guide_profiles: true,
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour không tồn tại');
    }

    // 2. Kiểm tra không phải chủ tour gửi request cho chính mình
    if (tour.guide_profiles.user_id === userId) {
      throw new BadRequestException(
        'Bạn không thể gửi yêu cầu tham gia tour của chính mình',
      );
    }

    // 2.5. Kiểm tra người dùng đã có yêu cầu đặt tour đang chờ hoặc đang hoạt động
    const existingRequest = await this.prisma.tour_requests.findFirst({
      where: {
        tour_id: tourId,
        schedule_id: scheduleId || null,
        user_id: userId,
        status: { in: ['pending', 'approved', 'paid'] },
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'Bạn đã có yêu cầu đặt tour đang chờ hoặc hoạt động cho chuyến này',
      );
    }

    // 3. Kiểm tra số lượng chỗ còn lại
    let maxParticipants = tour.max_participants;
    let schedule: any = null;

    if (scheduleId) {
      schedule = await this.prisma.tour_schedules.findUnique({
        where: { id: scheduleId }
      });
      if (!schedule || schedule.tour_id !== tourId) {
        throw new NotFoundException('Lịch khởi hành không hợp lệ');
      }
      maxParticipants = schedule.max_participants;
    }

    const approvedRequests = await this.prisma.tour_requests.aggregate({
      where: {
        tour_id: tourId,
        schedule_id: scheduleId || null,
        status: { in: ['approved', 'payment_pending', 'paid'] },
      },
      _sum: {
        participant_count: true,
      },
    });

    const currentParticipants = approvedRequests._sum.participant_count || 0;
    if (currentParticipants + participantCount > maxParticipants) {
      throw new BadRequestException(
        `Chỉ còn ${maxParticipants - currentParticipants} chỗ trống cho đợt này`,
      );
    }

    // 5. Tạo request
    const request = await this.prisma.tour_requests.create({
      data: {
        tour_id: tourId,
        schedule_id: scheduleId || null,
        user_id: userId,
        participant_count: participantCount,
        note,
        status: 'pending',
      },
      include: {
        tours: true,
      },
    });

    // 6. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'tour_request.created',
      'TOUR_REQUEST',
      request.id,
      { tour_title: tour.title },
    );

    return request;
  }

  async getUserRequests(userId: string, query: TourRequestQueryDto) {
    const { status, tourId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };
    if (status) where.status = status;
    if (tourId) where.tour_id = tourId;

    const [requests, total] = await Promise.all([
      this.prisma.tour_requests.findMany({
        where,
        include: {
          tour_schedules: true,
          tours: {
            include: {
              tour_images: {
                orderBy: { is_cover: 'desc' },
                take: 1
              },
              guide_profiles: {
                include: {
                  users: true,
                },
              },
            },
          },
          tour_reviews: true,
          guide_reviews: true,
          payment_transactions: {
            where: { status: 'paid' },
            orderBy: { created_at: 'desc' },
          }
        },
        orderBy: { requested_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.tour_requests.count({ where }),
    ]);

    return {
      data: requests.map((req) => {
        const lastPaidTransaction = req.payment_transactions[0];
        const price = req.tour_schedules ? Number(req.tour_schedules.price) : Number(req.tours.price);
        const totalPrice = price * req.participant_count;
        let paymentStatus = 'Chưa thanh toán';
        
        if (lastPaidTransaction) {
          const paidAmount = Number(lastPaidTransaction.amount);
          if (paidAmount >= totalPrice) {
            paymentStatus = 'Đã thanh toán 100%';
          } else if (paidAmount >= totalPrice * 0.45) {
            paymentStatus = 'Đã thanh toán 50% (Cọc)';
          } else {
            paymentStatus = `Đã thanh toán ${paidAmount.toLocaleString()} đ`;
          }
        }

        return {
          id: req.id,
          tourId: req.tour_id,
          tourTitle: req.tours.title,
          tourImage: req.tours.tour_images.find(img => img.is_cover)?.image_url || req.tours.tour_images[0]?.image_url,
          startDate: req.tour_schedules?.start_date,
          guideId: req.tours.guide_profiles.id, // Using profile ID for navigation
          guideUserId: req.tours.guide_profiles.user_id,
          guideName: req.tours.guide_profiles.users?.full_name,
          guideAvatar: req.tours.guide_profiles.avatar_url || req.tours.guide_profiles.users?.avatar_url,
          participantCount: req.participant_count,
          status: req.status,
          requestedAt: req.requested_at,
          processedAt: req.processed_at,
          responseNote: req.response_note,
          cancellationNote: req.cancellation_note,
          tourPrice: price,
          totalPrice: totalPrice,
          paymentStatus: paymentStatus,
          hasTourReview: !!req.tour_reviews,
          hasGuideReview: !!req.guide_reviews,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getGuideRequests(userId: string, query: TourRequestQueryDto) {
    const { status, tourId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Tìm guide profile
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      throw new ForbiddenException('Bạn không phải là hướng dẫn viên');
    }

    const where: any = {
      tours: {
        guide_profile_id: guideProfile.id,
      },
    };
    if (status) where.status = status;
    if (tourId) where.tour_id = tourId;
    if (query.scheduleId) where.schedule_id = query.scheduleId;

    const [requests, total] = await Promise.all([
      this.prisma.tour_requests.findMany({
        where,
        include: {
          users_tour_requests_user_idTousers: true,
          tour_schedules: true,
          tours: {
            include: {
              tour_images: {
                orderBy: { is_cover: 'desc' },
                take: 1
              },
              guide_profiles: {
                include: {
                  users: true
                }
              }
            }
          },
          payment_transactions: {
            where: { status: 'paid' },
            orderBy: { created_at: 'desc' },
          }
        },
        orderBy: { requested_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.tour_requests.count({ where }),
    ]);

    return {
      data: requests.map((req) => {
        const lastPaidTransaction = req.payment_transactions[0];
        const price = req.tour_schedules ? Number(req.tour_schedules.price) : Number(req.tours.price);
        const totalPrice = price * req.participant_count;
        let paymentStatus = 'Chưa thanh toán';
        
        if (lastPaidTransaction) {
          const paidAmount = Number(lastPaidTransaction.amount);
          if (paidAmount >= totalPrice) {
            paymentStatus = 'Đã thanh toán 100%';
          } else if (paidAmount >= totalPrice * 0.45) {
            paymentStatus = 'Đã thanh toán 50% (Cọc)';
          } else {
            paymentStatus = `Đã thanh toán ${paidAmount.toLocaleString()} đ`;
          }
        }

        return {
          id: req.id,
          tourId: req.tour_id,
          tourTitle: req.tours.title,
          tourImage: req.tours.tour_images.find(img => img.is_cover)?.image_url || req.tours.tour_images[0]?.image_url,
          startDate: req.tour_schedules?.start_date,
          guideId: req.tours.guide_profiles.id,
          guideName: req.tours.guide_profiles.users.full_name,
          guideAvatar: req.tours.guide_profiles.avatar_url || req.tours.guide_profiles.users.avatar_url,
          userName: req.users_tour_requests_user_idTousers.full_name,
          userAvatar: req.users_tour_requests_user_idTousers.avatar_url,
          participantCount: req.participant_count,
          status: req.status,
          note: req.note,
          responseNote: req.response_note,
          cancellationNote: req.cancellation_note,
          requestedAt: req.requested_at,
          processedAt: req.processed_at,
          paymentStatus: paymentStatus,
          totalPrice: totalPrice,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async cancelRequest(
    userId: string,
    requestId: string,
    dto: CancelTourRequestDto,
  ) {
    const request = await this.prisma.tour_requests.findUnique({
      where: { id: requestId },
      include: { 
        tours: { include: { guide_profiles: true } },
        tour_schedules: true
      },
    });

    if (!request) {
      throw new NotFoundException('Yêu cầu không tồn tại');
    }

    if (request.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy yêu cầu này');
    }

    if (request.status !== 'pending' && request.status !== 'approved' && request.status !== 'paid') {
      throw new BadRequestException(
        'Chỉ có thể hủy yêu cầu đang chờ, đã duyệt hoặc đã thanh toán',
      );
    }

    let nextStatus = 'cancelled_by_user';
    let refundAmount = 0;
    const hasPaid = request.status === 'paid';

    if (hasPaid) {
      // Calculate amount paid from database transactions
      const paidTransactions = await this.prisma.payment_transactions.findMany({
        where: {
          tour_request_id: requestId,
          status: 'paid',
        },
      });
      const totalPaid = paidTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

      if (totalPaid > 0) {
        // Calculate days to start date
        const startDateVal = request.tour_schedules?.start_date || request.tours.start_date;
        if (startDateVal) {
          const start = new Date(startDateVal);
          const now = new Date();
          
          // Clear time for calculation
          start.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
          
          const diffTime = start.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays >= 3) {
            refundAmount = totalPaid; // 100% refund
            nextStatus = 'refund_pending';
          } else if (diffDays >= 1) {
            refundAmount = totalPaid * 0.5; // 50% refund
            nextStatus = 'refund_pending';
          } else {
            refundAmount = 0; // 0% refund
            nextStatus = 'cancelled_by_user';
          }
        }
      }
    }

    const updatedRequest = await this.prisma.tour_requests.update({
      where: { id: requestId },
      data: {
        status: nextStatus,
        cancelled_at: new Date(),
        cancellation_note: dto.reason || (nextStatus === 'refund_pending' ? `Người dùng hủy - Đang chờ hoàn tiền ${refundAmount.toLocaleString()}đ` : 'Người dùng đã hủy yêu cầu'),
      },
    });

    // If refund is pending, create a refund transaction record in payment_transactions
    if (refundAmount > 0) {
      await this.prisma.payment_transactions.create({
        data: {
          tour_request_id: requestId,
          user_id: userId,
          amount: -refundAmount, // negative amount to represent refund
          payment_method: 'vnpay',
          status: 'refund_pending',
          transaction_code: `REFUND-${requestId.substring(0, 8)}-${Date.now()}`,
        },
      });
    }

    // 4. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'tour_request.cancelled',
      'TOUR_REQUEST',
      requestId,
      { tour_title: request.tours.title, refund_amount: refundAmount },
    );

    // Thông báo cho Guide
    await this.notificationsService.create({
      user_id: request.tours.guide_profiles.user_id,
      title: 'Yêu cầu tham gia tour bị hủy',
      content: `Người dùng đã hủy yêu cầu tham gia tour "${request.tours.title}".${refundAmount > 0 ? ` (Chờ hoàn tiền: ${refundAmount.toLocaleString()} đ)` : ''}`,
      type: 'tour_request',
      entity_type: 'TOUR_REQUEST',
      entity_id: requestId,
    });

    return updatedRequest;
  }

  async processRequest(
    guideUserId: string,
    requestId: string,
    status: 'approved' | 'rejected',
    dto: UpdateTourRequestStatusDto,
  ) {
    const request = await this.prisma.tour_requests.findUnique({
      where: { id: requestId },
      include: {
        tours: {
          include: {
            guide_profiles: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Yêu cầu không tồn tại');
    }

    if (request.tours.guide_profiles.user_id !== guideUserId) {
      throw new ForbiddenException('Bạn không có quyền xử lý yêu cầu này');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException(
        'Chỉ có thể xử lý yêu cầu đang ở trạng thái chờ',
      );
    }

    if (status === 'approved') {
      let maxParticipants = 999;
      if (request.schedule_id) {
        const schedule = await this.prisma.tour_schedules.findUnique({ where: { id: request.schedule_id } });
        if (schedule) maxParticipants = schedule.max_participants;
      }

      const existingRequests = await this.prisma.tour_requests.findMany({
        where: {
          tour_id: request.tour_id,
          schedule_id: request.schedule_id,
          status: { in: ['approved', 'paid', 'payment_pending'] },
        },
      });
      const currentParticipants = existingRequests.reduce((sum, req) => sum + req.participant_count, 0);

      if (currentParticipants + request.participant_count > maxParticipants) {
        throw new BadRequestException(`Không thể duyệt. Số lượng người tham gia vượt quá giới hạn tối đa (${maxParticipants} người). Hiện đã có ${currentParticipants} người được duyệt.`);
      }
    }

    const updatedRequest = await this.prisma.tour_requests.update({
      where: { id: requestId },
      data: {
        status: status,
        response_note: dto.responseNote,
        processed_at: new Date(),
        processed_by_user_id: guideUserId,
      },
    });

    // 6. Tạo thông báo cho User trong DB
    const title =
      status === 'approved'
        ? 'Yêu cầu tham gia tour được chấp nhận'
        : 'Yêu cầu tham gia tour bị từ chối';
    const content =
      status === 'approved'
        ? `Hướng dẫn viên đã chấp nhận yêu cầu tham gia tour "${request.tours.title}" của bạn.`
        : `Rất tiếc, yêu cầu tham gia tour "${request.tours.title}" của bạn đã bị từ chối.`;

    // 6. Ghi log hoạt động
    await this.activityLogsService.log(
      guideUserId,
      'tour_request.processed',
      'TOUR_REQUEST',
      requestId,
      { status: status, tour_title: request.tours.title },
    );

    await this.notificationsService.create({

      user_id: request.user_id,
      title: title,
      content: content,
      type: 'tour_request',
      entity_type: 'TOUR_REQUEST',
      entity_id: requestId,
    });



    // 7. Phát tín hiệu realtime cho User qua Socket
    this.socketGateway.sendToUser(request.user_id, 'tour_request_processed', {
      requestId: requestId,
      status: status,
      tourTitle: request.tours.title,
      message: content,
    });

    // 8. Log activity for Guide
    await this.activityLogsService.log(
      guideUserId,
      'TOUR_REQUEST_PROCESSED',
      'TOUR_REQUEST',
      requestId,
      { status, tourTitle: request.tours.title },
    );

    return updatedRequest;

  }
}
