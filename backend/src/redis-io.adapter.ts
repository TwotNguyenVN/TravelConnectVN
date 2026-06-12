import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private redisAdapter: ReturnType<typeof createAdapter> | undefined;
  private readonly logger = new Logger(RedisIoAdapter.name);

  async connectToRedis(): Promise<void> {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || 6379;
    const redisPassword = process.env.REDIS_PASSWORD;
    const isUpstash = redisHost.includes('upstash');

    try {
      this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

      const pubClient = createClient({
        socket: {
          host: redisHost,
          port: Number(redisPort),
          tls: isUpstash ? true : undefined,
        },
        password: redisPassword,
      });
      const subClient = pubClient.duplicate();

      pubClient.on('error', (err: Error) =>
        this.logger.error(`Redis PubClient Error: ${err.message}`),
      );
      subClient.on('error', (err: Error) =>
        this.logger.error(`Redis SubClient Error: ${err.message}`),
      );

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.redisAdapter = createAdapter(pubClient, subClient);
      this.logger.log('Redis adapter connected successfully');
    } catch (error) {
      const err = error as Error;
      this.logger.warn(
        `Failed to connect to Redis (${err.message}). Falling back to memory adapter.`,
      );
      this.redisAdapter = undefined;
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options) as {
      adapter: (adapter: unknown) => void;
    };
    if (this.redisAdapter) {
      server.adapter(this.redisAdapter);
      this.logger.log('Socket.io server is using Redis Adapter');
    }
    return server;
  }
}
