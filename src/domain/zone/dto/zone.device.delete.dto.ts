import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class DeviceDeleteByZoneDto {
  @IsUUID('4')
  zoneId: string;

  @IsArray()
  @ArrayNotEmpty()
  deviceIds: number[];
}
