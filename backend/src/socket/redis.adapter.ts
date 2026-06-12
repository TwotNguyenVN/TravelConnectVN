import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplicationContext, Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || 6379;
    const redisPassword = process.env.REDIS_PASSWORD;
    const isUpstash = redisHost.includes('upstash');
    const url = isUpstash
      ? `rediss://default:${redisPassword}@${redisHost}:${redisPort}`
      : `redis://${redisHost}:${redisPort}`;

    try {
      this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
      const pubClient = createClient({ url });
      const subClient = pubClient.duplicate();

      // Register error handlers to prevent unhandled exception crashes
      pubClient.on('error', (err: Error) =>
        this.logger.error(`Redis PubClient Error: ${err.message}`),
      );
      subClient.on('error', (err: Error) =>
        this.logger.error(`Redis SubClient Error: ${err.message}`),
      );

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.logger.log('Redis adapter connected successfully for socket.io');
    } catch (err: any) {
      this.logger.error(`Failed to initialize Redis Adapter: ${err.message}. Falling back to default memory adapter.`);
    }
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
<<<<<<< Updated upstream
=======
      this.logger.log('Socket.io server is using Redis Adapter');
>>>>>>> Stashed changes
    }
    return server;
  }
}

