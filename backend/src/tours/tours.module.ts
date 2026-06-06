import { Module } from '@nestjs/common';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModerationModule } from '../ai-moderation/ai-moderation.module';

@Module({
  imports: [PrismaModule, AiModerationModule],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
