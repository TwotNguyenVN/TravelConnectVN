import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '../prisma/prisma.module';

import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';

@Module({
  imports: [PrismaModule, UserActivityLogsModule],

  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
