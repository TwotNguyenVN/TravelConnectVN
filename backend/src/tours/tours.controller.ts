import { Controller, Get, Param, Query } from '@nestjs/common';
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
}
