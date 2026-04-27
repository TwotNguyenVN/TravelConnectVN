import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanionPostDto } from './dto/create-companion-post.dto';
import { UpdateCompanionPostDto } from './dto/update-companion-post.dto';
import { CompanionPostQueryDto } from './dto/companion-post-query.dto';
import { CreateCompanionRequestDto } from './dto/create-companion-request.dto';
import { ProcessCompanionRequestDto } from './dto/process-companion-request.dto';
import { ApiResponse } from '../common/interfaces/response.interface';

import { SocketGateway } from '../socket/socket.gateway';
import { NotificationsService } from '../notifications/notifications.service';

import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

@Injectable()
export class CompanionPostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketGateway: SocketGateway,
    private readonly notificationsService: NotificationsService,
    private readonly activityLogsService: UserActivityLogsService,
  ) {}


  async getPublicCompanionPosts(query: CompanionPostQueryDto): Promise<ApiResponse<any>> {
    const {
      destination,
      startDateFrom,
      startDateTo,
      status = 'open',
      page = '1',
      limit = '10',
      sortBy = 'created_at:desc',
    } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      business_status: status,
      visibility_status: 'visible',
      deleted_at: null,
    };

    if (destination) {
      where.destination = { contains: destination, mode: 'insensitive' };
    }

    if (startDateFrom || startDateTo) {
      where.start_date = {};
      if (startDateFrom) where.start_date.gte = new Date(startDateFrom);
      if (startDateTo) where.start_date.lte = new Date(startDateTo);
    }

    const [field, order] = sortBy.split(':');
    const orderBy = { [field]: order as 'asc' | 'desc' };

    const [total, items] = await Promise.all([
      this.prisma.companion_posts.count({ where }),
      this.prisma.companion_posts.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          users: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true,
            },
          },
          _count: {
            select: {
              companion_requests: {
                where: { status: 'approved' },
              },
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      message: 'Companion posts retrieved successfully',
      data: {
        items,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    };
  }

  async getCompanionPostDetail(id: string): Promise<ApiResponse<any>> {
    const post = await this.prisma.companion_posts.findFirst({
      where: { id, deleted_at: null },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
        companion_requests: {
          where: { status: 'approved' },
          include: {
            users_companion_requests_user_idTousers: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Companion post not found');
    }

    return {
      success: true,
      message: 'Companion post detail retrieved successfully',
      data: post,
    };
  }

  async createCompanionPost(userId: string, data: CreateCompanionPostDto): Promise<ApiResponse<any>> {
    const post = await this.prisma.companion_posts.create({
      data: {
        user_id: userId,
        title: data.title,
        destination: data.destination,
        start_date: new Date(data.startDate),
        end_date: new Date(data.endDate),
        estimated_cost: data.estimatedCost,
        currency_code: data.currencyCode || 'VND',
        expected_members: data.expectedMembers,
        description: data.description,
        requirements: data.requirements,
        business_status: 'open',
        visibility_status: 'visible',
        images: data.images || [],
      },
    });

    // 3. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'companion_post.created',
      'COMPANION_POST',
      post.id,
      { title: post.title },
    );

    return {

      success: true,
      message: 'Companion post created successfully',
      data: post,
    };
  }

  async updateCompanionPost(userId: string, id: string, data: UpdateCompanionPostDto): Promise<ApiResponse<any>> {
    const post = await this.prisma.companion_posts.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Companion post not found');
    }

    if (post.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to update this post');
    }

    const updatedPost = await this.prisma.companion_posts.update({
      where: { id },
      data: {
        title: data.title,
        destination: data.destination,
        start_date: data.startDate ? new Date(data.startDate) : undefined,
        end_date: data.endDate ? new Date(data.endDate) : undefined,
        estimated_cost: data.estimatedCost,
        currency_code: data.currencyCode,
        expected_members: data.expectedMembers,
        description: data.description,
        requirements: data.requirements,
        business_status: data.businessStatus,
        visibility_status: data.visibilityStatus,
        images: data.images,
        updated_at: new Date(),
      } as any,
    });

    // 3. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'companion_post.updated',
      'COMPANION_POST',
      id,
      { title: updatedPost.title },
    );

    return {

      success: true,
      message: 'Companion post updated successfully',
      data: updatedPost,
    };
  }

  async softDeleteCompanionPost(userId: string, id: string): Promise<ApiResponse<any>> {
    const post = await this.prisma.companion_posts.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Companion post not found');
    }

    if (post.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this post');
    }

    await this.prisma.companion_posts.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'Companion post deleted successfully',
    };
  }

  async getMyCompanionPosts(userId: string, query: any): Promise<ApiResponse<any>> {
    const { page = '1', limit = '10', status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      user_id: userId,
      deleted_at: null,
    };

    if (status) {
      where.business_status = status;
    }

    const [total, items] = await Promise.all([
      this.prisma.companion_posts.count({ where }),
      this.prisma.companion_posts.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              companion_requests: {
                where: { status: 'pending' },
              },
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      message: 'My companion posts retrieved successfully',
      data: {
        items,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    };
  }

  // ==========================================
  // COMPANION REQUESTS LOGIC
  // ==========================================

  async sendJoinRequest(userId: string, data: CreateCompanionRequestDto): Promise<ApiResponse<any>> {
    const { postId, message } = data;

    // 1. Check if post exists and is open
    const post = await this.prisma.companion_posts.findFirst({
      where: { id: postId, deleted_at: null },
    });

    if (!post) {
      throw new NotFoundException('Companion post not found');
    }

    if (post.business_status !== 'open') {
      throw new ForbiddenException('This post is no longer accepting requests');
    }

    // 2. Cannot request own post
    if (post.user_id === userId) {
      throw new ForbiddenException('You cannot join your own post');
    }

    // 3. Check for existing active request
    const existingRequest = await this.prisma.companion_requests.findFirst({
      where: {
        post_id: postId,
        user_id: userId,
        status: { in: ['pending', 'approved'] },
      },
    });

    if (existingRequest) {
      throw new ForbiddenException('You already have an active request for this post');
    }

    // 4. Create request
    const request = await this.prisma.companion_requests.create({
      data: {
        post_id: postId,
        user_id: userId,
        message,
        status: 'pending',
      },
    });

    // 5. Ghi log hoạt động
    await this.activityLogsService.log(
      userId,
      'companion_request.created',
      'COMPANION_REQUEST',
      request.id,
      { post_title: post.title },
    );

    // 6. Tạo thông báo trong DB + Socket realtime cho chủ bài đăng

    await this.notificationsService.create({
      user_id: post.user_id,
      title: 'Yêu cầu tham gia đoàn mới',
      content: `Người dùng đã gửi yêu cầu tham gia đoàn "${post.title}" của bạn.`,
      type: 'companion_request',
      entity_type: 'COMPANION_REQUEST',
      entity_id: request.id,
    });



    // 6. Phát tín hiệu realtime cho chủ bài đăng qua Socket
    this.socketGateway.sendToUser(post.user_id, 'new_companion_request', {
      postId: postId,
      message: `Có người muốn tham gia đoàn "${post.title}" của bạn!`,
    });

    return {
      success: true,
      message: 'Join request sent successfully',
      data: request,
    };
  }

  async getMySentRequests(userId: string, query: any): Promise<ApiResponse<any>> {
    const { page = '1', limit = '10', status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      user_id: userId,
    };

    if (status) {
      where.status = status;
    }

    const [total, items] = await Promise.all([
      this.prisma.companion_requests.count({ where }),
      this.prisma.companion_requests.findMany({
        where,
        skip,
        take,
        orderBy: { requested_at: 'desc' },
        include: {
          companion_posts: {
            select: {
              id: true,
              title: true,
              destination: true,
              start_date: true,
              business_status: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      message: 'My sent requests retrieved successfully',
      data: {
        items,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    };
  }

  async getPostRequests(userId: string, postId: string, query: any): Promise<ApiResponse<any>> {
    // 1. Check if post exists and user is owner
    const post = await this.prisma.companion_posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Companion post not found');
    }

    if (post.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to view requests for this post');
    }

    const { page = '1', limit = '10', status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      post_id: postId,
    };

    if (status) {
      where.status = status;
    }

    const [total, items] = await Promise.all([
      this.prisma.companion_requests.count({ where }),
      this.prisma.companion_requests.findMany({
        where,
        skip,
        take,
        orderBy: { requested_at: 'desc' },
        include: {
          users_companion_requests_user_idTousers: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      message: 'Post requests retrieved successfully',
      data: {
        items,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    };
  }

  async cancelJoinRequest(userId: string, requestId: string): Promise<ApiResponse<any>> {
    const request = await this.prisma.companion_requests.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Join request not found');
    }

    if (request.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to cancel this request');
    }

    if (request.status !== 'pending') {
      throw new ForbiddenException('Only pending requests can be cancelled');
    }

    const updatedRequest = await this.prisma.companion_requests.update({
      where: { id: requestId },
      data: {
        status: 'cancelled',
        cancelled_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'Join request cancelled successfully',
      data: updatedRequest,
    };
  }

  async approveJoinRequest(userId: string, requestId: string, data: ProcessCompanionRequestDto): Promise<ApiResponse<any>> {
    const request = await this.prisma.companion_requests.findUnique({
      where: { id: requestId },
      include: { companion_posts: true },
    });

    if (!request) {
      throw new NotFoundException('Join request not found');
    }

    if (request.companion_posts.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to process this request');
    }

    if (request.status !== 'pending') {
      throw new ForbiddenException('Only pending requests can be approved');
    }

    // Check if post is still open
    if (request.companion_posts.business_status !== 'open') {
      throw new ForbiddenException('This post is no longer accepting members');
    }

    // Check if enough space
    const approvedCount = await this.prisma.companion_requests.count({
      where: { post_id: request.post_id, status: 'approved' },
    });

    if (approvedCount >= request.companion_posts.expected_members) {
      throw new ForbiddenException('This post has already reached its expected members count');
    }

    const updatedRequest = await this.prisma.companion_requests.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        response_note: data.responseNote,
        processed_at: new Date(),
        processed_by_user_id: userId,
      },
    });

    // Auto-close post if full
    if (approvedCount + 1 >= request.companion_posts.expected_members) {
      await this.prisma.companion_posts.update({
        where: { id: request.post_id },
        data: { business_status: 'closed' },
      });
    }

    // 3. Ghi log hoạt động (Người thực hiện là owner của post)
    const postOwnerId = request.companion_posts.user_id;
    await this.activityLogsService.log(
      postOwnerId,
      'companion_request.processed',
      'COMPANION_REQUEST',
      requestId,
      { status: 'approved', post_title: request.companion_posts.title },
    );

    // 4. Tạo thông báo trong DB + Socket realtime cho người gửi yêu cầu

    await this.notificationsService.create({
      user_id: request.user_id,
      title: 'Yêu cầu tham gia đoàn được chấp nhận',
      content: `Yêu cầu tham gia đoàn "${request.companion_posts.title}" của bạn đã được chấp nhận.`,
      type: 'companion_request',
      entity_type: 'COMPANION_REQUEST',
      entity_id: requestId,
    });



    // 4. Phát tín hiệu realtime qua Socket
    this.socketGateway.sendToUser(request.user_id, 'companion_request_processed', {
      postId: request.post_id,
      status: 'approved',
      message: `Yêu cầu tham gia đoàn "${request.companion_posts.title}" của bạn đã được CHẤP NHẬN!`,
    });

    return {
      success: true,
      message: 'Join request approved successfully',
      data: updatedRequest,
    };
  }

  async rejectJoinRequest(userId: string, requestId: string, data: ProcessCompanionRequestDto): Promise<ApiResponse<any>> {
    const request = await this.prisma.companion_requests.findUnique({
      where: { id: requestId },
      include: { companion_posts: true },
    });

    if (!request) {
      throw new NotFoundException('Join request not found');
    }

    if (request.companion_posts.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to process this request');
    }

    if (request.status !== 'pending') {
      throw new ForbiddenException('Only pending requests can be rejected');
    }

    const updatedRequest = await this.prisma.companion_requests.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        response_note: data.responseNote,
        processed_at: new Date(),
        processed_by_user_id: userId,
      },
    });

    return {
      success: true,
      message: 'Join request rejected successfully',
      data: updatedRequest,
    };
  }

  async getMyRequestForPost(userId: string, postId: string): Promise<ApiResponse<any>> {
    const request = await this.prisma.companion_requests.findFirst({
      where: { post_id: postId, user_id: userId },
      orderBy: { requested_at: 'desc' },
    });

    return {
      success: true,
      message: 'User request for post retrieved successfully',
      data: request,
    };
  }
}
