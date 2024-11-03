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
  await app.listen(3000);
}
bootstrap();
