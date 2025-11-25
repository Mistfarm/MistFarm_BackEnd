import { IsString, IsNotEmpty } from 'class-validator';
import { PlantType } from '../../zone/plant.types';

export class ZoneSettingQueryDto {
  @IsString()
  @IsNotEmpty()
  zoneId: string;
}

export interface ZoneSettingResponseAuto {
  growthLevel: number;
  humidity: number;
  temperature: number;
  plant: PlantType;
  mode: true;
  onInterval: string; // "HH:MM:SS"
  offInterval: string; // "HH:MM:SS"
  nutrientsRate: number;
}

export interface ZoneSettingResponseManual {
  growthLevel: number;
  humidity: number;
  temperature: number;
  plant: PlantType;
  mode: false;
  power: boolean;
  nutrientsRate: number;
}
