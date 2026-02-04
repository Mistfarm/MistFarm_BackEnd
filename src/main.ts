import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // WebSocket 어댑터 설정 (필수!)
  app.useWebSocketAdapter(new IoAdapter(app));

  const options = new DocumentBuilder()
    .setTitle('MistFarm')
    .setDescription('지유인가요, 지호인가요?')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', '로컬 환경')
    .build();

  // CORS 설정 - Gateway와 동일하게
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://mistfarm.vercel.app',
    'https://mist-farm.online',
    'http://localhost:3000',
  ];

  console.log('🌐 [main.ts] CORS 허용 도메인:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      console.log('[main.ts CORS] origin:', origin);

      if (!origin || allowedOrigins.includes(origin)) {
        console.log('[main.ts CORS] ✅ 허용됨');
        callback(null, true);
      } else {
        console.log('[main.ts CORS] ❌ 차단됨:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
