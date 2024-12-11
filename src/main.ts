import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //This ensure that if any propety doesn't exist inside our DTO, Nestjs won't carry that property inside the controller as well.
      forbidNonWhitelisted: true, // Just the whitelist (the last parameter) wipes out the unkown propety, this parameter makes sure that Nestjs throw an error when a client tries to do that and do not process the request.
      transform: true, // Transforms the request object into a instance of the DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /* 
  Swagger configuration
  */

  const swaggerconfig = new DocumentBuilder()
    .setTitle('NestJs Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:8000')
    .setTermsOfService('http://localhost:8000/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:8000')
    .setVersion('1.0')
    .build();

  // Instantiate Document
  const document = SwaggerModule.createDocument(app, swaggerconfig);
  SwaggerModule.setup('api', app, document);

  // Setup the aws sdk used uploading the files to aws s3 bucket
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAcessKeyId'),
      secretAccessKey: configService.get('awsSecretAccessKey'),
    },
    region: configService.get('appConfig.awsRegion'),
  });

  app.enableCors();

  await app.listen(8000);
}
bootstrap();
