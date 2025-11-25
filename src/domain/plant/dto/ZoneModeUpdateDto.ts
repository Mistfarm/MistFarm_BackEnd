import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class ZoneModeUpdateDto {
  @IsString()
  @IsNotEmpty()
  zoneId: string;

  @IsBoolean()
  mode: boolean; // true: 자동, false: 수동
}
