import { IsString } from 'class-validator';

export class ZoneDevCreateDto {
  @IsString()
  zoneAuthId: string; // zoneId → zoneAuthId로 명확히

  @IsString()
  zonePassword: string;

  @IsString()
  zoneName: string;
}
