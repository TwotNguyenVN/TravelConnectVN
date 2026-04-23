import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { TourRequestsService } from './tour-requests.service';
import { CreateTourRequestDto } from './dto/create-tour-request.dto';
import { TourRequestQueryDto } from './dto/tour-request-query.dto';
import {
  UpdateTourRequestStatusDto,
  CancelTourRequestDto,
} from './dto/update-tour-request-status.dto';

@ApiTags('Tour Requests')
@ApiBearerAuth()
@Controller('tour-requests')
@UseGuards(AuthGuard)
export class TourRequestsController {
  constructor(private readonly tourRequestsService: TourRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Gửi yêu cầu tham gia tour' })
  async createRequest(@Request() req, @Body() dto: CreateTourRequestDto) {
    const userId = req.user.id;
    return this.tourRequestsService.createRequest(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu đã gửi của tôi' })
  async getMyRequests(@Request() req, @Query() query: TourRequestQueryDto) {
    const userId = req.user.id;
    return this.tourRequestsService.getUserRequests(userId, query);
  }

  @Get('guide')
  @UseGuards(RoleGuard)
  @Roles(Role.GUIDE)
  @ApiOperation({
    summary: 'Lấy danh sách yêu cầu tham gia các tour của tôi (Guide view)',
  })
  async getGuideRequests(@Request() req, @Query() query: TourRequestQueryDto) {
    const userId = req.user.id;
    return this.tourRequestsService.getGuideRequests(userId, query);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy yêu cầu tham gia tour (User action)' })
  async cancelRequest(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: CancelTourRequestDto,
  ) {
    const userId = req.user.id;
    return this.tourRequestsService.cancelRequest(userId, id, dto);
  }

  @Patch(':id/approve')
  @UseGuards(RoleGuard)
  @Roles(Role.GUIDE)
  @ApiOperation({ summary: 'Chấp nhận yêu cầu tham gia tour (Guide action)' })
  async approveRequest(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateTourRequestStatusDto,
  ) {
    const userId = req.user.id;
    return this.tourRequestsService.processRequest(userId, id, 'approved', dto);
  }

  @Patch(':id/reject')
  @UseGuards(RoleGuard)
  @Roles(Role.GUIDE)
  @ApiOperation({ summary: 'Từ chối yêu cầu tham gia tour (Guide action)' })
  async rejectRequest(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateTourRequestStatusDto,
  ) {
    const userId = req.user.id;
    return this.tourRequestsService.processRequest(userId, id, 'rejected', dto);
  }
}
