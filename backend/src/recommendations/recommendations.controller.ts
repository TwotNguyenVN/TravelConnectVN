import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { AuthGuard } from '../common/guards/auth.guard';
import type { Request } from 'express';

@Controller('recommendations')
@UseGuards(AuthGuard)
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('tours')
  async getRecommendedTours(@Req() req: Request) {
    const userId = (req as any).user.id;
    const data = await this.recommendationsService.getRecommendations(userId);
    return {
      success: true,
      message: 'Lấy danh sách gợi ý thành công',
      data: data,
    };
  }
}
