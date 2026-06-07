import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { RedisIoAdapter } from './socket/redis.adapter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { I18nInterceptor } from './common/interceptors/i18n.interceptor';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Support for BigInt serialization
  (BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function (
    this: bigint,
  ) {
    return this.toString();
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global Request Logger & Manual CORS Middleware
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Security Headers
  app.use(helmet({ crossOriginResourcePolicy: false })); // allow serving images

  // Serve static files from uploads folder
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Global Request Logger
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Only logging, no manual CORS
    console.log(`[GLOBAL LOG] ${req.method} ${req.url}`);
    next();
  });

  // Standardization: Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Standardization: Global Transform Interceptor & I18n
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new I18nInterceptor()
  );

  // Standardization: Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Secure CORS Configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('TravelConnectVN API')
    .setDescription('The TravelConnectVN API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
