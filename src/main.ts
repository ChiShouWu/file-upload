import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // swagger setting
  const setting = new DocumentBuilder()
    .setTitle('Video Storage Server API')
    .setVersion('v1')
    .addBearerAuth()
    .build();

  const config = app.get<ConfigService>(ConfigService);

  const document = SwaggerModule.createDocument(app, setting);
  SwaggerModule.setup(config.get<string>('DOC_URL', 'docs'), app, document);

  // use validator
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = config.get<number>('PORT', 8080);
  await app.listen(port, () => {
    console.log(`app listening @${port}`);
  });
}
bootstrap();
