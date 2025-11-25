import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { ZonePlantServiceByHannah } from './service/plant.select.service';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { DeviceRepository } from '../../DB/repository/device.repository';

@Module({
  controllers: [PlantController],
  providers: [ZonePlantServiceByHannah, ZoneRepository, DeviceRepository],
  exports: [ZonePlantServiceByHannah],
})
export class PlantModule {}
