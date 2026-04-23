import { Module } from '@nestjs/common';
import { TourRequestsController } from './tour-requests.controller';
import { TourRequestsService } from './tour-requests.service';
import { PrismaModule } from '../prisma/prisma.module';

import { SocketModule } from '../socket/socket.module';
import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, SocketModule, UserActivityLogsModule, NotificationsModule],
  controllers: [TourRequestsController],
  providers: [TourRequestsService],
  exports: [TourRequestsService],
})
export class TourRequestsModule {}
