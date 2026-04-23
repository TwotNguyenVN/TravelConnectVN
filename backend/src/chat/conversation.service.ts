import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /conversations
   * Lấy danh sách conversation mà current user là participant.
   * Sắp xếp theo hoạt động mới nhất (updated_at desc).
   */
  async findAll(userId: string) {
    // Lấy tất cả conversation_id mà user là participant (chưa rời)
    const participantRows = await this.prisma.conversation_participants.findMany({
      where: {
        user_id: userId,
        left_at: null,
      },
      select: { conversation_id: true, last_read_at: true },
    });

    if (participantRows.length === 0) {
      return [];
    }

    const conversationIds = participantRows.map((p) => p.conversation_id);
    const readMap = new Map(participantRows.map((p) => [p.conversation_id, p.last_read_at]));

    // Lấy conversations với message mới nhất và participants rút gọn
    const conversations = await this.prisma.conversations.findMany({
      where: { id: { in: conversationIds } },
      orderBy: { updated_at: 'desc' },
      include: {
        conversation_participants: {
          where: { left_at: null },
          include: {
            users: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
        },
        messages: {
          orderBy: { sent_at: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            message_type: true,
            sent_at: true,
            sender_user_id: true,
          },
        },
        companion_posts: {
          select: { id: true, title: true, destination: true },
        },
      },
    });

    return conversations.map((conv) => {
      const lastMessage = conv.messages[0] ?? null;
      const lastReadAt = readMap.get(conv.id) ?? null;

      // Tính unread: số message sau last_read_at
      const hasUnread =
        lastMessage && lastReadAt
          ? lastMessage.sent_at > lastReadAt && lastMessage.sender_user_id !== userId
          : lastMessage && lastMessage.sender_user_id !== userId;

      // Tìm đối tác (dành cho direct chat: người không phải current user)
      const otherParticipants = conv.conversation_participants
        .filter((p) => p.user_id !== userId)
        .map((p) => ({
          userId: p.users.id,
          fullName: p.users.full_name,
          avatarUrl: p.users.avatar_url,
        }));

      return {
        id: conv.id,
        conversationType: conv.conversation_type,
        title: conv.title,
        relatedCompanionPostId: conv.related_companion_post_id,
        relatedTourId: conv.related_tour_id,
        companionPost: conv.companion_posts
          ? {
              id: conv.companion_posts.id,
              title: conv.companion_posts.title,
              destination: conv.companion_posts.destination,
            }
          : null,
        participants: otherParticipants,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              messageType: lastMessage.message_type,
              sentAt: lastMessage.sent_at,
              senderUserId: lastMessage.sender_user_id,
            }
          : null,
        lastMessageAt: conv.updated_at,
        hasUnread: !!hasUnread,
        lastReadAt,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
      };
    });
  }

  /**
   * POST /conversations/direct
   * Tạo hoặc lấy lại direct conversation giữa current user và guide.
   * Tránh tạo trùng: nếu đã có conversation giữa 2 người này thì trả về conversation cũ.
   */
  async createOrGetDirect(
    currentUserId: string,
    body: { guideUserId: string; relatedTourId?: string; initialMessage?: string },
  ) {
    const { guideUserId, relatedTourId } = body;

    if (currentUserId === guideUserId) {
      throw new ForbiddenException('Không thể tạo conversation với chính mình');
    }

    // Kiểm tra guide user tồn tại
    const guideUser = await this.prisma.public_users.findUnique({
      where: { id: guideUserId },
      select: { id: true, full_name: true },
    });
    if (!guideUser) {
      throw new NotFoundException('Người dùng đích không tồn tại');
    }

    // Tìm conversation direct hiện có giữa 2 người
    const existing = await this.findExistingDirectConversation(currentUserId, guideUserId);
    if (existing) {
      return this.enrichConversation(existing.id, currentUserId);
    }

    // Tạo mới
    const conversation = await this.prisma.conversations.create({
      data: {
        conversation_type: 'direct',
        created_by_user_id: currentUserId,
        related_tour_id: relatedTourId ?? null,
        conversation_participants: {
          create: [
            { user_id: currentUserId },
            { user_id: guideUserId },
          ],
        },
      },
    });

    return this.enrichConversation(conversation.id, currentUserId);
  }

  /**
   * POST /conversations/group-companion
   * Tạo group conversation cho một companion post.
   * Chỉ cho phép tạo nếu chưa có group conversation cho post này.
   * Participant: chủ bài + tất cả approved members.
   */
  async createGroupCompanion(currentUserId: string, body: { companionPostId: string }) {
    const { companionPostId } = body;

    // Validate companion post
    const post = await this.prisma.companion_posts.findUnique({
      where: { id: companionPostId },
      include: {
        companion_requests: {
          where: { status: 'approved' },
          select: { user_id: true },
        },
        conversations: { select: { id: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Bài đồng hành không tồn tại');
    }

    if (post.deleted_at) {
      throw new ForbiddenException('Bài đồng hành này đã bị xóa');
    }

    // Kiểm tra quyền: chỉ chủ bài mới được tạo group chat
    if (post.user_id !== currentUserId) {
      // Hoặc là approved member
      const isApproved = post.companion_requests.some((r) => r.user_id === currentUserId);
      if (!isApproved) {
        throw new ForbiddenException('Bạn không có quyền tạo chat nhóm cho bài đồng hành này');
      }
    }

    // Kiểm tra đã có group conversation chưa (unique constraint đã có trong DB)
    if (post.conversations) {
      return this.enrichConversation(post.conversations.id, currentUserId);
    }

    // Tập hợp participants: chủ bài + approved members
    const participantIds = new Set<string>([post.user_id]);
    post.companion_requests.forEach((r) => participantIds.add(r.user_id));

    const conversation = await this.prisma.conversations.create({
      data: {
        conversation_type: 'group_companion',
        title: post.title,
        created_by_user_id: currentUserId,
        related_companion_post_id: companionPostId,
        conversation_participants: {
          create: Array.from(participantIds).map((uid) => ({ user_id: uid })),
        },
      },
    });

    return this.enrichConversation(conversation.id, currentUserId);
  }

  /**
   * GET /conversations/:id/participants
   * Lấy danh sách participant của conversation.
   */
  async getParticipants(conversationId: string, userId: string) {
    await this.assertParticipant(conversationId, userId);

    const participants = await this.prisma.conversation_participants.findMany({
      where: {
        conversation_id: conversationId,
        left_at: null,
      },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            email: true,
          },
        },
      },
      orderBy: { joined_at: 'asc' },
    });

    const conv = await this.prisma.conversations.findUnique({
      where: { id: conversationId },
      select: { created_by_user_id: true },
    });

    return participants.map((p) => ({
      userId: p.users.id,
      fullName: p.users.full_name,
      avatarUrl: p.users.avatar_url,
      email: p.users.email,
      joinedAt: p.joined_at,
      lastReadAt: p.last_read_at,
      isMuted: p.is_muted,
      isOwner: p.user_id === conv?.created_by_user_id,
    }));
  }

  /**
   * PATCH /conversations/:id/read
   * Đánh dấu đã đọc conversation (cập nhật last_read_at).
   */
  async markAsRead(conversationId: string, userId: string) {
    await this.assertParticipant(conversationId, userId);

    await this.prisma.conversation_participants.update({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
      data: { last_read_at: new Date() },
    });
  }

  // ────────── Private helpers ──────────

  private async findExistingDirectConversation(userA: string, userB: string) {
    // Tìm conversation direct mà cả 2 người đều là participant
    const participantsA = await this.prisma.conversation_participants.findMany({
      where: { user_id: userA, left_at: null },
      select: { conversation_id: true },
    });
    const idsA = participantsA.map((p) => p.conversation_id);

    if (idsA.length === 0) return null;

    const matched = await this.prisma.conversations.findFirst({
      where: {
        id: { in: idsA },
        conversation_type: 'direct',
        conversation_participants: {
          some: { user_id: userB, left_at: null },
        },
      },
    });

    return matched;
  }

  private async enrichConversation(conversationId: string, currentUserId: string) {
    const conv = await this.prisma.conversations.findUnique({
      where: { id: conversationId },
      include: {
        conversation_participants: {
          where: { left_at: null },
          include: {
            users: {
              select: { id: true, full_name: true, avatar_url: true },
            },
          },
        },
        companion_posts: {
          select: { id: true, title: true, destination: true },
        },
        messages: {
          orderBy: { sent_at: 'desc' },
          take: 1,
        },
      },
    });

    if (!conv) throw new NotFoundException('Conversation không tồn tại');

    return {
      id: conv.id,
      conversationType: conv.conversation_type,
      title: conv.title,
      relatedCompanionPostId: conv.related_companion_post_id,
      relatedTourId: conv.related_tour_id,
      companionPost: conv.companion_posts ?? null,
      participants: conv.conversation_participants.map((p) => ({
        userId: p.users.id,
        fullName: p.users.full_name,
        avatarUrl: p.users.avatar_url,
        joinedAt: p.joined_at,
      })),
      lastMessage: conv.messages[0] ?? null,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
    };
  }

  async assertParticipant(conversationId: string, userId: string) {
    const conv = await this.prisma.conversations.findUnique({
      where: { id: conversationId },
    });
    if (!conv) throw new NotFoundException('Conversation không tồn tại');

    const participant = await this.prisma.conversation_participants.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
    });

    if (!participant || participant.left_at !== null) {
      throw new ForbiddenException('Bạn không có quyền truy cập conversation này');
    }

    return participant;
  }
}
