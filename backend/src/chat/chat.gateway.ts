/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      sub: string;
    };
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('ChatGateway');
  // Map user ID to Socket ID
  private userSockets = new Map<string, string[]>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const auth = client.handshake.auth as Record<string, string | undefined>;
      const headers = client.handshake.headers as Record<
        string,
        string | undefined
      >;

      const token =
        auth.token?.split(' ')[1] || headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'jwt-secret',
      });

      const userId = payload.sub;
      client.data.user = payload;

      const existingSockets = this.userSockets.get(userId) || [];
      this.userSockets.set(userId, [...existingSockets, client.id]);

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Connection error: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as AuthenticatedSocket).data?.user?.sub;
    if (userId) {
      const existingSockets = this.userSockets.get(userId) || [];
      const updatedSockets = existingSockets.filter((id) => id !== client.id);
      if (updatedSockets.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, updatedSockets);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    void client.join(`conversation_${conversationId}`);
    this.logger.log(
      `User ${client.data.user.sub} joined conversation ${conversationId}`,
    );
    return { status: 'joined', conversationId };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.to(`conversation_${conversationId}`).emit('user_typing', {
      userId: client.data.user.sub,
      conversationId,
    });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    payload: {
      conversationId: string;
      content: string;
      messageType?: string;
      attachmentUrl?: string;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.data.user.sub;

    // Save to DB
    const message = await this.chatService.saveMessage({
      conversationId: payload.conversationId,
      senderId: userId,
      content: payload.content,
      messageType: payload.messageType || 'text',
      attachmentUrl: payload.attachmentUrl,
    });

    // Broadcast to room
    this.server
      .to(`conversation_${payload.conversationId}`)
      .emit('new_message', message);
    return message;
  }
}
