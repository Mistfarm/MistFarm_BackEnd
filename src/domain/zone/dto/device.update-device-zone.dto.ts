import { IsUUID, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class DeviceUpdateZoneDto {
  @IsUUID('4')
  zoneId: string; // 바꿀 zoneId

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  deviceNames: string[];
}
