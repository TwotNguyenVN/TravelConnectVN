import { Module } from '@nestjs/common';
import { GuideVerificationController } from './guide-verification.controller';
import { GuideVerificationService } from './guide-verification.service';
import { PrismaModule } from '../prisma/prisma.module';

import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';

@Module({
  imports: [PrismaModule, UserActivityLogsModule],

  controllers: [GuideVerificationController],
  providers: [GuideVerificationService]
})
export class GuideVerificationModule {}
