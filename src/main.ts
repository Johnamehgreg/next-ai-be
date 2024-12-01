import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateNonEmptyBodyPipe } from './Pipes/validation-pipe';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  app.useGlobalPipes(new ValidateNonEmptyBodyPipe());
  app.enableCors();

  // Or customize CORS settings
  app.enableCors({
    origin: ['http://example.com', 'http://localhost:5173'], // specify allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow cookies or other credentials
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
}
bootstrap();
