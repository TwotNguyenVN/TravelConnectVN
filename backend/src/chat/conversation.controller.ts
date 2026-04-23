import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiResponse } from '../common/interfaces/response.interface';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * GET /conversations
   * Lấy danh sách conversation của current user (sắp theo mới nhất).
   */
  @Get()
  async findAll(@Request() req): Promise<ApiResponse<any>> {
    const result = await this.conversationService.findAll(req.user.id);
    return {
      success: true,
      message: 'Lấy danh sách hội thoại thành công',
      data: result,
    };
  }

  /**
   * POST /conversations/direct
   * Tạo hoặc lấy lại direct conversation giữa current user và guide.
   * Body: { guideUserId, relatedTourId?, initialMessage? }
   */
  @Post('direct')
  async createDirect(
    @Request() req,
    @Body() body: { guideUserId: string; relatedTourId?: string; initialMessage?: string },
  ): Promise<ApiResponse<any>> {
    const result = await this.conversationService.createOrGetDirect(req.user.id, body);
    return {
      success: true,
      message: 'Tạo hội thoại trực tiếp thành công',
      data: result,
    };
  }

  /**
   * POST /conversations/group-companion
   * Tạo group conversation cho một companion post.
   * Body: { companionPostId }
   */
  @Post('group-companion')
  async createGroupCompanion(
    @Request() req,
    @Body() body: { companionPostId: string },
  ): Promise<ApiResponse<any>> {
    const result = await this.conversationService.createGroupCompanion(req.user.id, body);
    return {
      success: true,
      message: 'Tạo nhóm chat bài đồng hành thành công',
      data: result,
    };
  }

  /**
   * GET /conversations/:id/participants
   * Lấy danh sách participant của conversation.
   */
  @Get(':id/participants')
  async getParticipants(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ApiResponse<any>> {
    const result = await this.conversationService.getParticipants(id, req.user.id);
    return {
      success: true,
      message: 'Lấy danh sách thành viên thành công',
      data: result,
    };
  }

  /**
   * PATCH /conversations/:id/read
   * Đánh dấu conversation đã đọc (cập nhật last_read_at).
   */
  @Patch(':id/read')
  async markAsRead(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ApiResponse<any>> {
    await this.conversationService.markAsRead(id, req.user.id);
    return {
      success: true,
      message: 'Đã đánh dấu hội thoại là đã đọc',
    };
  }
}
