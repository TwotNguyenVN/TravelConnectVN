import { Module } from '@nestjs/common';
import { TrustSafetyService } from './trust-safety.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TrustSafetyService],
  exports: [TrustSafetyService],
})
export class TrustSafetyModule {}
