import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { RedisHealthIndicator } from './redis.health';

@Module({
  imports: [
    TerminusModule,
    PrismaModule,
    ConfigModule,
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
    BullModule.registerQueue({
      name: 'schedulerQueue',
    }),
  ],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
