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
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Trong production nên giới hạn lại
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SocketGateway');

  // Lưu trữ mapping giữa userId và socketId
  private userSockets: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Xóa mapping khi disconnect
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    this.logger.log(`User ${data.userId} registered with socket ${client.id}`);
    this.userSockets.set(data.userId, client.id);
    client.join(`user_${data.userId}`);
    return { status: 'ok' };
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
