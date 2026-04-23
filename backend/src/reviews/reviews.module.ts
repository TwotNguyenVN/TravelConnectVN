import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../prisma/prisma.module';

import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';

@Module({
  imports: [PrismaModule, UserActivityLogsModule],

  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
