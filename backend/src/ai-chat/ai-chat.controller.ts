import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { AuthGuard } from '../common/guards/auth.guard';
import type { Request } from 'express';

@Controller('ai-chat')
@UseGuards(AuthGuard)
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Get('sessions')
  async getSessions(@Req() req: Request) {
    const userId = (req as any).user.id;
    const data = await this.aiChatService.getSessions(userId);
    return {
      success: true,
      message: 'Lấy danh sách phiên chat thành công',
      data,
    };
  }

  @Post('sessions')
  async createSession(@Req() req: Request) {
    const userId = (req as any).user.id;
    const data = await this.aiChatService.createSession(userId);
    return {
      success: true,
      message: 'Tạo phiên chat mới thành công',
      data,
    };
  }

  @Get('sessions/:id/messages')
  async getMessages(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.id;
    const data = await this.aiChatService.getMessages(id, userId);
    return {
      success: true,
      message: 'Lấy tin nhắn thành công',
      data,
    };
  }

  @Post('sessions/:id/messages')
  async sendMessage(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    const userId = (req as any).user.id;
    const data = await this.aiChatService.sendMessage(id, userId, body.content);
    return {
      success: true,
      message: 'Gửi tin nhắn thành công',
      data,
    };
  }

  @Delete('sessions/:id')
  async deleteSession(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.id;
    const data = await this.aiChatService.deleteSession(id, userId);
    return {
      success: true,
      message: 'Xóa phiên chat thành công',
      data,
    };
  }

  @Patch('sessions/:id/context')
  async updateSessionContext(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { context: any },
  ) {
    const userId = (req as any).user.id;
    const data = await this.aiChatService.updateSessionContext(id, userId, body.context);
    return {
      success: true,
      message: 'Cập nhật ngữ cảnh phiên chat thành công',
      data,
    };
  }
}
