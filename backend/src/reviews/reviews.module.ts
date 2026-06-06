import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../prisma/prisma.module';

import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';
import { AiModerationModule } from '../ai-moderation/ai-moderation.module';

@Module({
  imports: [PrismaModule, UserActivityLogsModule, AiModerationModule],

  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
