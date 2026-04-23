import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Support for BigInt serialization
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  const app = await NestFactory.create(AppModule);
  
  // Global Request Logger & Manual CORS Middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    
    console.log(`[GLOBAL LOG] ${req.method} ${req.url}`);
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Standardization: Global Exception Filter
  const { HttpExceptionFilter } = require('./common/filters/http-exception.filter');
  app.useGlobalFilters(new HttpExceptionFilter());

  // Standardization: Global Transform Interceptor
  const { TransformInterceptor } = require('./common/interceptors/transform.interceptor');
  app.useGlobalInterceptors(new TransformInterceptor());

  // Standardization: Global Validation Pipe
  const { ValidationPipe } = require('@nestjs/common');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
