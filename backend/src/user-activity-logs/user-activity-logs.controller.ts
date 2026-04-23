import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserActivityLogsService } from './user-activity-logs.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiResponse } from '../common/interfaces/response.interface';

@Controller('me')
@UseGuards(AuthGuard)
export class UserActivityLogsController {
  constructor(private readonly activityLogsService: UserActivityLogsService) {}

  @Get('activity-logs')
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('activityType') activityType?: string,
  ): Promise<ApiResponse<any>> {
    const result = await this.activityLogsService.findAll(req.user.id, page, limit, activityType);
    return {
      success: true,
      message: 'Lấy nhật ký hoạt động thành công',
      data: result,
    };
  }
}
