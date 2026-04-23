import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiResponse } from '../common/interfaces/response.interface';

@Controller('conversations')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * GET /conversations/:id/messages
   * Lấy danh sách message trong conversation (có phân trang).
   */
  @Get(':id/messages')
  async findMessages(
    @Request() req,
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<ApiResponse<any>> {
    const result = await this.messageService.findMessages(
      id,
      req.user.id,
      Number(page),
      Number(limit),
    );
    return {
      success: true,
      message: 'Lấy danh sách tin nhắn thành công',
      data: result,
    };
  }

  /**
   * POST /conversations/:id/messages
   * Gửi tin nhắn mới vào conversation.
   * Body: { content, messageType? }
   */
  @Post(':id/messages')
  async sendMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { content: string; messageType?: string },
  ): Promise<ApiResponse<any>> {
    const result = await this.messageService.sendMessage(id, req.user.id, body);
    return {
      success: true,
      message: 'Gửi tin nhắn thành công',
      data: result,
    };
  }
}
