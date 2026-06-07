import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiResponse } from '../common/interfaces/response.interface';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<ApiResponse<unknown>> {
    const result = await this.notificationsService.findAll(
      req.user.id,
      page,
      limit,
    );
    return {
      success: true,
      message: 'Lấy danh sách thông báo thành công',
      data: result,
    };
  }

  @Get('unread-count')
  async getUnreadCount(
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiResponse<unknown>> {
    const result = await this.notificationsService.getUnreadCount(req.user.id);
    return {
      success: true,
      message: 'Lấy số lượng thông báo chưa đọc thành công',
      data: result,
    };
  }

  @Patch('read-all')
  async markAllAsRead(
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiResponse<unknown>> {
    await this.notificationsService.markAllAsRead(req.user.id);
    return {
      success: true,
      message: 'Đã đánh dấu tất cả thông báo là đã đọc',
    };
  }

  @Patch(':id/read')
  async markAsRead(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<unknown>> {
    await this.notificationsService.markAsRead(req.user.id, id);
    return {
      success: true,
      message: 'Đã đánh dấu thông báo là đã đọc',
    };
  }

  @Delete(':id')
  async delete(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<unknown>> {
    await this.notificationsService.delete(req.user.id, id);
    return {
      success: true,
      message: 'Đã xóa thông báo',
    };
  }
}
