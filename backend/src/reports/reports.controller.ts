import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';

import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string };
}

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
}
