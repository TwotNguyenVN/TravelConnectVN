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

    // 4. Kiểm tra user đã có request active cho tour này chưa
    const existingRequest = await this.prisma.tour_requests.findFirst({
      where: {
        tour_id: tourId,
        user_id: userId,
        status: { in: ['pending', 'approved', 'payment_pending', 'paid'] },
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'Bạn đã có một yêu cầu tham gia tour này đang được xử lý hoặc đã được chấp nhận',
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

    // 7. Tạo thông báo cho Guide trong DB + Socket realtime

    await this.notificationsService.create({
      user_id: tour.guide_profiles.user_id,
      title: 'Yêu cầu tham gia tour mới',
      content: `Người dùng đã gửi yêu cầu tham gia tour "${tour.title}" của bạn.`,
      type: 'tour_request',
      entity_type: 'TOUR_REQUEST',
      entity_id: request.id,
    });



    // 7. Phát tín hiệu realtime cho Guide qua Socket
    this.socketGateway.sendToUser(tour.guide_profiles.user_id, 'new_tour_request', {
      requestId: request.id,
      tourTitle: tour.title,
      message: `Bạn có một yêu cầu tham gia tour mới cho "${tour.title}"`,
    });

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
          tours: {
            include: {
              guide_profiles: {
                include: {
                  users: true,
                },
              },
            },
          },
          tour_reviews: true,
          guide_reviews: true,
        },
        orderBy: { requested_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.tour_requests.count({ where }),
    ]);

    return {
      data: requests.map((req) => ({
        id: req.id,
        tourId: req.tour_id,
        tourTitle: req.tours.title,
        guideName: req.tours.guide_profiles.users?.full_name,
        participantCount: req.participant_count,
        status: req.status,
        requestedAt: req.requested_at,
        processedAt: req.processed_at,
        responseNote: req.response_note,
        cancellationNote: req.cancellation_note,
        tourPrice: Number(req.tours.price),
        hasTourReview: !!req.tour_reviews,
        hasGuideReview: !!req.guide_reviews,
      })),
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

    const [requests, total] = await Promise.all([
      this.prisma.tour_requests.findMany({
        where,
        include: {
          users_tour_requests_user_idTousers: true,
          tours: true,
        },
        orderBy: { requested_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.tour_requests.count({ where }),
    ]);

    return {
      data: requests.map((req) => ({
        id: req.id,
        tourId: req.tour_id,
        tourTitle: req.tours.title,
        userName: req.users_tour_requests_user_idTousers.full_name,
        userAvatar: req.users_tour_requests_user_idTousers.avatar_url,
        participantCount: req.participant_count,
        status: req.status,
        note: req.note,
        responseNote: req.response_note,
        cancellationNote: req.cancellation_note,
        requestedAt: req.requested_at,
        processedAt: req.processed_at,
      })),
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
      include: { tours: { include: { guide_profiles: true } } },
    });

    if (!request) {
      throw new NotFoundException('Yêu cầu không tồn tại');
    }

    if (request.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy yêu cầu này');
    }

    if (request.status !== 'pending' && request.status !== 'approved') {
      throw new BadRequestException(
        'Chỉ có thể hủy yêu cầu đang chờ hoặc đã được duyệt (nếu chưa thanh toán)',
      );
    }

    const updatedRequest = await this.prisma.tour_requests.update({
      where: { id: requestId },
      data: {
        status: 'cancelled_by_user',
        cancelled_at: new Date(),
        cancellation_note: dto.reason || 'Người dùng đã hủy yêu cầu',
      },
    });

    // 4. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'tour_request.cancelled',
      'TOUR_REQUEST',
      requestId,
      { tour_title: request.tours.title },
    );

    // Thông báo cho Guide

    await this.notificationsService.create({
      user_id: request.tours.guide_profiles.user_id,
      title: 'Yêu cầu tham gia tour bị hủy',
      content: `Người dùng đã hủy yêu cầu tham gia tour "${request.tours.title}".`,
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
