import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccommodationsService {
  constructor(private prisma: PrismaService) {}

  async getTourAccommodations(tourId: string) {
    try {
      const tour = await this.prisma.tours.findUnique({
        where: { id: tourId },
      });
      if (!tour) {
        throw new NotFoundException('Không tìm thấy thông tin tour');
      }

      // Lấy danh sách liên kết
      const links = await this.prisma.tour_accommodations.findMany({
        where: { tour_id: tourId },
        include: {
          partner_accommodations: true,
        },
        orderBy: {
          sort_order: 'asc',
        },
      });

      return links.map(link => ({
        ...link.partner_accommodations,
        check_in_date: link.check_in_date,
        check_out_date: link.check_out_date,
        notes: link.notes,
      }));
    } catch (error) {
      console.error('Error getting accommodations for tour:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get tour accommodations');
    }
  }

  async getAllAccommodations() {
    try {
      return await this.prisma.partner_accommodations.findMany({
        where: { status: 'active' },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      console.error('Error getting all accommodations:', error);
      throw new InternalServerErrorException('Failed to get accommodations');
    }
  }

  async getAccommodationById(id: string) {
    try {
      const acc = await this.prisma.partner_accommodations.findUnique({
        where: { id },
      });
      if (!acc) {
        throw new NotFoundException('Không tìm thấy thông tin điểm lưu trú');
      }
      return acc;
    } catch (error) {
      console.error('Error getting accommodation by id:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get accommodation detail');
    }
  }
}
