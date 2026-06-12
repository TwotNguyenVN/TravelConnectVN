import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

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

    const pubClient = createClient({ url });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.error('Redis PubClient Error:', err.message));
    subClient.on('error', (err) => console.error('Redis SubClient Error:', err.message));

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.adapterConstructor = createAdapter(pubClient, subClient);
      console.log('Connected to Redis for Socket.IO');
    } catch (error) {
      console.error('Failed to connect to Redis. Falling back to in-memory adapter for Socket.IO', (error as Error).message);
    }
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    return server;
  }
}
