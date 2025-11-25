import { IsString, IsBoolean } from 'class-validator';

export class ZoneModeUpdateDto {
  @IsString()
  zone_id: string;

  @IsBoolean()
  mode: boolean; // true: 자동, false: 수동
}
