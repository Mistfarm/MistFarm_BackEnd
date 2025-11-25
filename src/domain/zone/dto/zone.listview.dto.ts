import { IsEnum, IsString } from 'class-validator';
import { PLANT_TYPES, PlantType } from '../plant.types';

export class ZoneSummaryResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(PLANT_TYPES)
  plant: PlantType;
}

export class ZonesResponse {
  zones: ZoneSummaryResponse[];
}
