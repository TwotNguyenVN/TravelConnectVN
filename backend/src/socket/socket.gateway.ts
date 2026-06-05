import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@WebSocketGateway({
  cors: {
    origin: '*', // Trong production nên giới hạn lại
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SocketGateway');

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Chúng ta vẫn giữ set socket ID trên memory của Node này (chỉ dùng nội bộ để log)
  // Việc lưu online status thực sự sẽ dùng Redis để đồng bộ toàn cụm.
  private userSockets: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    let disconnectedUserId: string | null = null;

    for (const [userId, socketIds] of this.userSockets.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        if (socketIds.size === 0) {
          this.userSockets.delete(userId);
          disconnectedUserId = userId;
        }
        break;
      }
    }

    if (disconnectedUserId) {
      // Xóa khỏi Redis
      await this.cacheManager.del(`online_user:${disconnectedUserId}`);
      // Thông báo cho tất cả biết user này offline
      this.broadcast('user_status_change', {
        userId: disconnectedUserId,
        status: 'offline',
      });
    }
  }

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`User ${data.userId} registered with socket ${client.id}`);

    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)?.add(client.id);

    void client.join(`user_${data.userId}`);

    // Lưu vào Redis (TTL = 1 day, user hoạt động sẽ reconnect/refresh)
    await this.cacheManager.set(
      `online_user:${data.userId}`,
      'online',
      86400000,
    );

    // Broadcast status change
    this.broadcast('user_status_change', {
      userId: data.userId,
      status: 'online',
    });

    return { status: 'ok' };
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody()
    data: {
      conversationId: string;
      targetUserId: string;
      senderId: string;
    },
  ) {
    // Forward typing event to target user
    this.sendToUser(data.targetUserId, 'typing_start', {
      conversationId: data.conversationId,
      userId: data.senderId,
    });
  }

  @SubscribeMessage('typing_end')
  handleTypingEnd(
    @MessageBody()
    data: {
      conversationId: string;
      targetUserId: string;
      senderId: string;
    },
  ) {
    // Forward typing end event to target user
    this.sendToUser(data.targetUserId, 'typing_end', {
      conversationId: data.conversationId,
      userId: data.senderId,
    });
  }

  // Lấy trạng thái online từ Redis (tiện ích cho các Service khác)
  async checkUserOnline(userId: string): Promise<boolean> {
    const status = await this.cacheManager.get(`online_user:${userId}`);
    return status === 'online';
  }

  // Hàm helper để gửi thông báo cho 1 user cụ thể
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  // Gửi thông báo cho tất cả
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
