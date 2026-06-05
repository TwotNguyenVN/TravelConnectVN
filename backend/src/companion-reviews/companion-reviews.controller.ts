import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CompanionReviewsService } from './companion-reviews.service';
import { CreateCompanionReviewDto } from './dto/create-companion-review.dto';

import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('companion-reviews')
@Controller('companion-reviews')
export class CompanionReviewsController {
  constructor(
    private readonly companionReviewsService: CompanionReviewsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a companion review' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateCompanionReviewDto,
  ) {
    const userId = req.user.id;
    return this.companionReviewsService.create(userId, dto);
  }

  @Get('host/:hostId')
  @ApiOperation({ summary: 'Get reviews for a host' })
  async getHostReviews(
    @Param('hostId') hostId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.companionReviewsService.getHostReviews(
      hostId,
      Number(page),
      Number(limit),
    );
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get reviews for a companion post' })
  async getPostReviews(@Param('postId') postId: string) {
    return this.companionReviewsService.getPostReviews(postId);
  }
}
