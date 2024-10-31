import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateNonEmptyBodyPipe } from './Pipes/validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //   }),
  // );
  app.useGlobalPipes(new ValidateNonEmptyBodyPipe());
  await app.listen(3000);
}
bootstrap();
