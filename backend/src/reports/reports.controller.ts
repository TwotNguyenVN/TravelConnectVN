import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';

import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Reports')
@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() dto: CreateReportDto, @Req() req: AuthenticatedRequest) {
    return this.reportsService.create(req.user.id, dto);
  }

  @Get('me')
  getMyReports(@Req() req: AuthenticatedRequest) {
    return this.reportsService.getMyReports(req.user.id);
  }

  @Get('heatmap')
  getReportHeatmap() {
    return this.reportsService.getReportHeatmap();
  }

  @Get()
  getAllReports(@Query('status') status?: string) {
    return this.reportsService.getAllReports(status);
  }

  @Post(':id/resolve')
  resolveReport(
    @Param('id') id: string,
    @Body()
    body: { action: 'dismiss' | 'hide' | 'warn'; resolutionNote: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reportsService.resolveReport(
      id,
      req.user.id,
      body.action,
      body.resolutionNote,
    );
  }
}
