import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('MistFarm')
    .setDescription('지유인가요, 지호인가요?')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', '로컬 환경')
    .build();

  app.enableCors({
    origin: 'https://mist-farm.online', // 허용할 도메인
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true, // 쿠키 허용 시
  });

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
