import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceModule } from './device/device.module';
import { AuthModule } from './auth/auth.module';
import { PlantModule } from './plant/plant.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [AuthModule, DeviceModule, PlantModule, NoticeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
