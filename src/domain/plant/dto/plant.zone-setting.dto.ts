import { PlantType } from '../../zone/plant.types';
//
// export class ZoneSettingQueryDto {
//   @IsNotEmpty({ message: 'zone-id는 필수입니다.' })
//   @IsUUID('4', { message: 'zone-id는 유효한 UUID여야 합니다.' })
//   zoneId: string; // 내부적으로는 카멜케이스 사용
// }

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
