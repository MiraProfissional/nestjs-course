import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //This ensure that if any propety doesn't exist inside our DTO, Nestjs won't carry that property inside the controller as well.
      forbidNonWhitelisted: true, // Just the whitelist (the last parameter) wipes out the unkown propety, this parameter makes sure that Nestjs throw an error when a client tries to do that and do not process the request.
    }),
  );
  await app.listen(8000);
}
bootstrap();
