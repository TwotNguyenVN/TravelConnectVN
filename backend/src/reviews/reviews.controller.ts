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
import { ReviewsService } from './reviews.service';
import { CreateTourReviewDto, CreateGuideReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('tours')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a tour review' })
  async createTourReview(@Request() req, @Body() dto: CreateTourReviewDto) {
    const userId = req.user.id;
    return this.reviewsService.createTourReview(userId, dto);
  }

  @Post('guides')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a guide review' })
  async createGuideReview(@Request() req, @Body() dto: CreateGuideReviewDto) {
    const userId = req.user.id;
    return this.reviewsService.createGuideReview(userId, dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user reviews' })
  async getMyReviews(@Request() req) {
    const userId = req.user.id;
    return this.reviewsService.getMyReviews(userId);
  }

  @Get('tours/:tourId')
  @ApiOperation({ summary: 'Get reviews for a tour' })
  async getTourReviews(
    @Param('tourId') tourId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewsService.getTourReviews(tourId, page, limit);
  }

  @Get('guides/:guideId')
  @ApiOperation({ summary: 'Get reviews for a guide' })
  async getGuideReviews(
    @Param('guideId') guideId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewsService.getGuideReviews(guideId, page, limit);
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  @Get('admin/all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews for admin' })
  async getAllReviewsAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.reviewsService.getAllReviewsAdmin(page, limit);
  }

  @Post('admin/visibility')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review visibility' })
  async updateReviewVisibility(
    @Body() body: { type: 'TOUR' | 'GUIDE', id: string, status: string }
  ) {
    return this.reviewsService.updateReviewVisibility(body.type, body.id, body.status);
  }
}
