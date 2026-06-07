import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisHealthIndicator } from './redis.health';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@ApiTags('Health')
@Controller('api/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private prismaService: PrismaService,
    private memory: MemoryHealthIndicator,
    private redisHealthIndicator: RedisHealthIndicator,
    @InjectQueue('mailQueue') private mailQueue: Queue,
    @InjectQueue('schedulerQueue') private schedulerQueue: Queue,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
      () => this.redisHealthIndicator.isHealthy('redis'),
      async () => {
        try {
          const counts = await this.mailQueue.getJobCounts();
          return {
            bullmq_mailQueue: {
              status: 'up',
              counts,
            },
          };
        } catch (e: unknown) {
          const err = e as Error;
          return {
            bullmq_mailQueue: {
              status: 'down',
              message: err.message,
            },
          };
        }
      },
      async () => {
        try {
          const counts = await this.schedulerQueue.getJobCounts();
          return {
            bullmq_schedulerQueue: {
              status: 'up',
              counts,
            },
          };
        } catch (e: unknown) {
          const err = e as Error;
          return {
            bullmq_schedulerQueue: {
              status: 'down',
              message: err.message,
            },
          };
        }
      },
    ]);
  }
}
