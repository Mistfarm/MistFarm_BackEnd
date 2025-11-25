import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceModule } from './domain/device/device.module';
import { AuthModule } from './domain/auth/auth.module';
import { PlantModule } from './domain/plant/plant.module';
import { NoticeModule } from './domain/notice/notice.module';
import { DataBaseModule } from './DB/data.base.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceSubscriber } from './domain/device/device.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      subscribers: [DeviceSubscriber],
    }),
    AuthModule,
    DeviceModule,
    PlantModule,
    NoticeModule,
    DataBaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
