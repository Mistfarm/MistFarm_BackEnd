import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';

@Module({
  controllers: [PlantController],
})
export class PlantModule {}
