import { Module } from '@nestjs/common';
import { ContentModeratorService } from './content-moderator.service';
import { ContentModeratorController } from './content-moderator.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TrustSafetyModule } from '../trust-safety/trust-safety.module';

@Module({
  imports: [PrismaModule, TrustSafetyModule],
  providers: [ContentModeratorService],
  controllers: [ContentModeratorController],
})
export class ContentModeratorModule {}
