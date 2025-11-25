import { IsString, IsNotEmpty } from 'class-validator';
import { PlantType } from '../../zone/plant.types';

export class ZoneSettingQueryDto {
  @IsString()
  @IsNotEmpty()
  zone_id: string;
}

export interface ZoneSettingResponseAuto {
  growth_level: number;
  humidity: number;
  temperature: number;
  plant: PlantType;
  mode: true;
  on_interval: string; // "HH:MM:SS"
  off_interval: string; // "HH:MM:SS"
  nutrients_rate: number;
}

export interface ZoneSettingResponseManual {
  growth_level: number;
  humidity: number;
  temperature: number;
  plant: PlantType;
  mode: false;
  power: boolean;
  nutrients_rate: number;
}
