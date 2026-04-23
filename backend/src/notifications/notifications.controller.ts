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

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<ApiResponse<any>> {
    const result = await this.notificationsService.findAll(req.user.id, page, limit);
    return {
      success: true,
      message: 'Lấy danh sách thông báo thành công',
      data: result,
    };
  }


  @Get('unread-count')
  async getUnreadCount(@Request() req): Promise<ApiResponse<any>> {
    const result = await this.notificationsService.getUnreadCount(req.user.id);
    return {
      success: true,
      message: 'Lấy số lượng thông báo chưa đọc thành công',
      data: result,
    };
  }

  @Patch('read-all')

  async markAllAsRead(@Request() req): Promise<ApiResponse<any>> {
    await this.notificationsService.markAllAsRead(req.user.id);
    return {
      success: true,
      message: 'Đã đánh dấu tất cả thông báo là đã đọc',
    };
  }

  @Patch(':id/read')
  async markAsRead(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ApiResponse<any>> {
    await this.notificationsService.markAsRead(req.user.id, id);
    return {
      success: true,
      message: 'Đã đánh dấu thông báo là đã đọc',
    };
  }

  @Delete(':id')
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ApiResponse<any>> {
    await this.notificationsService.delete(req.user.id, id);
    return {
      success: true,
      message: 'Đã xóa thông báo',
    };
  }
}
