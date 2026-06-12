import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private configService: ConfigService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');

    const client = new Redis({
      host,
      port,
      password,
      tls: host.includes('upstash') ? {} : undefined,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true, // we will manually connect/ping
    });

    try {
      await client.connect();
      await client.ping();
      client.disconnect();
      return this.getStatus(key, true);
    } catch (e: unknown) {
      client.disconnect();
      const err = e as Error;
      throw new HealthCheckError(
        'Redis health check failed',
        this.getStatus(key, false, { message: err.message }),
      );
    }
  }
}
