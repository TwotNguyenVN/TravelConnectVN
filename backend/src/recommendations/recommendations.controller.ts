import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { AuthGuard } from '../common/guards/auth.guard';
import type { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Recommendations')
@Controller('recommendations')
@UseGuards(AuthGuard)
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('tours')
  async getRecommendedTours(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.recommendationsService.getRecommendations(userId);
    return {
      success: true,
      message: 'Lấy danh sách gợi ý thành công',
      data: data,
    };
  }

  @Post('track')
  async trackUserActivity(
    @Req() req: AuthenticatedRequest,
    @Body() body: { tourId: string; action: string },
  ) {
    const userId = req.user.id;
    return await this.recommendationsService.trackActivity(
      userId,
      body.tourId,
      body.action,
    );
  }
}
