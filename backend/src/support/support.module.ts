import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SosModule } from '../sos/sos.module';
import { AiChatModule } from '../ai-chat/ai-chat.module';

@Module({
  imports: [PrismaModule, NotificationsModule, SosModule, AiChatModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
