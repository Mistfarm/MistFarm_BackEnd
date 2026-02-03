import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { ZonePlantServiceByHannah } from './service/plant.select.service';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { DeviceRepository } from '../../DB/repository/device.repository';
import { PlantService } from './plant.service';
import { DeviceSubscriber } from '../device/device.subscriber';

@Module({
  controllers: [PlantController],
  providers: [
    DeviceSubscriber,
    ZonePlantServiceByHannah,
    ZoneRepository,
    DeviceRepository,
    PlantService,
  ],
  exports: [ZonePlantServiceByHannah],
})
export class PlantModule {}
