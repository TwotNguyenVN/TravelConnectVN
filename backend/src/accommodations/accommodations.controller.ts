import { Controller, Get, Param } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  async getAllAccommodations() {
    const data = await this.accommodationsService.getAllAccommodations();
    return {
      success: true,
      message: 'Lấy danh sách điểm lưu trú thành công',
      data: data,
    };
  }

  @Get('tour/:tourId')
  async getTourAccommodations(@Param('tourId') tourId: string) {
    const data = await this.accommodationsService.getTourAccommodations(tourId);
    return {
      success: true,
      message: 'Lấy danh sách điểm lưu trú của tour thành công',
      data: data,
    };
  }

  @Get(':id')
  async getAccommodationById(@Param('id') id: string) {
    const data = await this.accommodationsService.getAccommodationById(id);
    return {
      success: true,
      message: 'Lấy chi tiết điểm lưu trú thành công',
      data: data,
    };
  }
}
