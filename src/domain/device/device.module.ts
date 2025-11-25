import { Module } from '@nestjs/common';
import { DeviceGateway } from './device.gateway';
import { DeviceSubscriber } from './device.subscriber';
import { DeviceService } from './device.service';
import { DataBaseModule } from '../../DB/data.base.module';

@Module({
  providers: [DeviceGateway, DeviceSubscriber, DeviceService],
  imports: [DataBaseModule],
})
export class DeviceModule {}
