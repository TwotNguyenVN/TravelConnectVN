import { Module } from '@nestjs/common';
import { CompanionPostsController } from './companion-posts.controller';
import { CompanionPostsService } from './companion-posts.service';

import { PrismaModule } from '../prisma/prisma.module';

import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';

import { SocketModule } from '../socket/socket.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, UserActivityLogsModule, SocketModule, NotificationsModule],
  controllers: [CompanionPostsController],
  providers: [CompanionPostsService]
})
export class CompanionPostsModule {}
