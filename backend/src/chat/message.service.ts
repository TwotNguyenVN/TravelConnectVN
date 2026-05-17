import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationService } from './conversation.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly conversationService: ConversationService,
    private readonly socketGateway: SocketGateway,
  ) {}

  /**
   * GET /conversations/:id/messages
   * Lấy danh sách message trong conversation.
   * Phân trang: page + limit, sắp xếp mới nhất trước.
   */
  async findMessages(
    conversationId: string,
    userId: string,
    page = 1,
    limit = 30,
  ) {
    await this.conversationService.assertParticipant(conversationId, userId);

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.messages.findMany({
        where: {
          conversation_id: conversationId,
          deleted_at: null,
        },
        orderBy: { sent_at: 'desc' },
        skip,
        take: limit,
        include: {
          users: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true,
            },
          },
        },
      }),
      this.prisma.messages.count({
        where: {
          conversation_id: conversationId,
          deleted_at: null,
        },
      }),
    ]);

    const items = messages.reverse().map((msg) => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      content: msg.content,
      messageType: msg.message_type,
      attachmentUrl: msg.attachment_url,
      sentAt: msg.sent_at,
      editedAt: msg.edited_at,
      isOwn: msg.sender_user_id === userId,
      sender: {
        id: msg.users.id,
        fullName: msg.users.full_name,
        avatarUrl: msg.users.avatar_url,
      },
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + messages.length < total,
      },
    };
  }

  /**
   * POST /conversations/:id/messages
   * Gửi message mới vào conversation.
   * Body: { content, messageType? }
   */
  async sendMessage(
    conversationId: string,
    userId: string,
    body: { content: string; messageType?: string },
  ) {
    await this.conversationService.assertParticipant(conversationId, userId);

    const { content, messageType = 'text' } = body;

    if (!content || content.trim().length === 0) {
      throw new BadRequestException('Nội dung tin nhắn không được trống');
    }

    // Tạo message
    const message = await this.prisma.messages.create({
      data: {
        conversation_id: conversationId,
        sender_user_id: userId,
        content: content.trim(),
        message_type: messageType,
      },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
      },
    });

    // Cập nhật updated_at của conversation (để sort list đúng)
    await this.prisma.conversations.update({
      where: { id: conversationId },
      data: { updated_at: new Date() },
    });

    // Lấy danh sách thành viên khác để gửi thông báo tin nhắn mới và cập nhật số unread
    const otherParticipants = await this.prisma.conversation_participants.findMany({
      where: {
        conversation_id: conversationId,
        user_id: { not: userId },
        left_at: null,
      },
      select: { user_id: true },
    });

    const messageData = {
      id: message.id,
      conversationId: message.conversation_id,
      content: message.content,
      messageType: message.message_type,
      attachmentUrl: message.attachment_url,
      sentAt: message.sent_at,
      isOwn: false,
      sender: {
        id: message.users.id,
        fullName: message.users.full_name,
        avatarUrl: message.users.avatar_url,
      },
    };

    // Gửi sự kiện cho từng thành viên
    for (const p of otherParticipants) {
      // 1. Emit tin nhắn mới để hiển thị trong khung chat
      this.socketGateway.sendToUser(p.user_id, 'new_message', messageData);

      // 2. Tính lại tổng số tin nhắn chưa đọc của thành viên này và emit
      const newUnreadCount = await this.conversationService.getUnreadMessageCount(p.user_id);
      this.socketGateway.sendToUser(p.user_id, 'unread_message_count_updated', { count: newUnreadCount });
    }

    return {
      id: message.id,
      conversationId: message.conversation_id,
      content: message.content,
      messageType: message.message_type,
      attachmentUrl: message.attachment_url,
      sentAt: message.sent_at,
      isOwn: true,
      sender: {
        id: message.users.id,
        fullName: message.users.full_name,
        avatarUrl: message.users.avatar_url,
      },
    };
  }
}
