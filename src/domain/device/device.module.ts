import { Module } from '@nestjs/common';
import { DeviceGateway } from './device.gateway';
import { DeviceSubscriber } from './device.subscriber';
import { DeviceService } from './device.service';
import { DataBaseModule } from '../../DB/data.base.module';
import { DeviceRepository } from '../../DB/repository/device.repository';

@Module({
  exports: [DeviceRepository],
  providers: [DeviceGateway, DeviceSubscriber, DeviceService, DeviceRepository],
  imports: [DataBaseModule],
})
export class DeviceModule {}
