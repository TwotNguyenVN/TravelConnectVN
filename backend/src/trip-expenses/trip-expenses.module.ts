import { Module } from '@nestjs/common';
import { TripExpensesController } from './trip-expenses.controller';
import { TripExpensesService } from './trip-expenses.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TripExpensesController],
  providers: [TripExpensesService],
})
export class TripExpensesModule {}
