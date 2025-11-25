import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PLANT_TYPES, PlantType } from '../../zone/plant.types';

export class ZonePlantSelectDto {
  @IsString()
  @IsNotEmpty()
  zoneId: string;

  @IsEnum(PLANT_TYPES)
  plant: PlantType;
}
