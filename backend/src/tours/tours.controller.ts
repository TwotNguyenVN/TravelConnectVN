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
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  async getTours(
    @Query('keyword') keyword?: string,
    @Query('province') province?: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.toursService.getPublicTours({
      keyword,
      province,
      categoryId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('categories')
  async getCategories() {
    return this.toursService.getTourCategories();
  }

  @Get('home/featured-tours')
  async getFeaturedTours() {
    return this.toursService.getFeaturedTours();
  }

  @Get('home/featured-guides')
  async getFeaturedGuides() {
    return this.toursService.getFeaturedGuides();
  }

  @Get('home/latest-companions')
  async getLatestCompanions() {
    return this.toursService.getLatestCompanionPosts();
  }

  @Get(':id')
  async getTourDetail(@Param('id') id: string) {
    return this.toursService.getPublicTourDetail(id);
  }

  @Get(':id/reviews')
  async getTourReviews(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.toursService.getTourReviews(id, Number(page), Number(limit));
  }

  // ==========================================
  // GUIDE MANAGEMENT ENDPOINTS
  // ==========================================

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Get('guide/me')
  async getMyGuidedTours(
    @Request() req,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const userId = req.user.id;
    return this.toursService.getMyGuidedTours(userId, {
      status,
      keyword,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Post('guide/create')
  async createTour(@Request() req, @Body() data: any) {
    const userId = req.user.id;
    return this.toursService.createTour(userId, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Patch('guide/:id')
  async updateTour(@Request() req, @Param('id') id: string, @Body() data: any) {
    const userId = req.user.id;
    return this.toursService.updateTour(userId, id, data);
  }

  @Get(':id/itinerary')
  async getTourItinerary(@Param('id') id: string) {
    return this.toursService.getTourItinerary(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Post(':id/itinerary')
  async updateTourItinerary(
    @Request() req,
    @Param('id') id: string,
    @Body() locations: any[],
  ) {
    const userId = req.user.id;
    return this.toursService.updateTourItinerary(userId, id, locations);
  }

  @Get(':id/images')
  async getTourImages(@Param('id') id: string) {
    return this.toursService.getTourImages(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Post(':id/images')
  async updateTourImages(
    @Request() req,
    @Param('id') id: string,
    @Body() images: any[],
  ) {
    const userId = req.user.id;
    return this.toursService.updateTourImages(userId, id, images);
  }
}
