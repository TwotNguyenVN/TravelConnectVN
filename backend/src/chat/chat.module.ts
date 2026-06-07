import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [PrismaModule, JwtModule.register({}), SupabaseModule],
  controllers: [ChatController, ConversationController, MessageController],
  providers: [ChatGateway, ChatService, ConversationService, MessageService],
  exports: [ChatService, ConversationService, MessageService],
})
export class ChatModule {}
