import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { ZonePlantServiceByHannah } from './service/plant.select.service';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { DeviceRepository } from '../../DB/repository/device.repository';
import { PlantService } from './plant.service';
import { DeviceModule } from '../device/device.module';
import { DataBaseModule } from '../../DB/data.base.module';

@Module({
  controllers: [PlantController],
  providers: [
    ZonePlantServiceByHannah,
    ZoneRepository,
    DeviceRepository,
    PlantService,
  ],
  exports: [ZonePlantServiceByHannah],
  imports: [DeviceModule, DataBaseModule],
})
export class PlantModule {}
