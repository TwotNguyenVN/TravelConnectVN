import { Module } from '@nestjs/common';
import { CompanionReviewsController } from './companion-reviews.controller';
import { CompanionReviewsService } from './companion-reviews.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';

@Module({
  imports: [PrismaModule, UserActivityLogsModule],
  controllers: [CompanionReviewsController],
  providers: [CompanionReviewsService],
  exports: [CompanionReviewsService],
})
export class CompanionReviewsModule {}
