import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Bootstraps and starts the NestJS application with API documentation and global validation.
 *
 * Configures Swagger/OpenAPI with the "MistFarm" metadata and mounts the UI at `/api-docs`, enables a global ValidationPipe for request validation, and starts the HTTP server on the port specified by `PORT` or 3000.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('MistFarm')
    .setDescription('지유인가요, 지호인가요?')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', '로컬 환경')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();