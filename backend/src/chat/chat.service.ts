import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(data: {
    conversationId: string;
    senderId: string;
    content: string;
    messageType: string;
    attachmentUrl?: string;
  }) {
    // Verify conversation exists
    const conv = await this.prisma.conversations.findUnique({
      where: { id: data.conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.messages.create({
      data: {
        conversation_id: data.conversationId,
        sender_user_id: data.senderId,
        content: data.content,
        message_type: data.messageType,
        attachment_url: data.attachmentUrl,
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
  }

  async getConversations(userId: string) {
    // Find all conversations where the user is a participant
    const participants = await this.prisma.conversation_participants.findMany({
      where: { user_id: userId },
      include: {
        conversations: {
          include: {
            conversation_participants: {
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
            },
          },
        },
      },
    });

    return participants.map((p) => p.conversations);
  }

  async getMessages(conversationId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    return this.prisma.messages.findMany({
      where: { conversation_id: conversationId },
      orderBy: { sent_at: 'asc' },
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
    });
  }
}
