import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() dto: CreateReportDto, @Req() req: any) {
    return this.reportsService.create(req.user.id, dto);
  }

  @Get('me')
  getMyReports(@Req() req: any) {
    return this.reportsService.getMyReports(req.user.id);
  }
}
