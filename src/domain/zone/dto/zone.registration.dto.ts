import { IsString } from 'class-validator';

export class ZoneRegistrationDto {
  @IsString()
  zoneId: string;

  @IsString()
  zonePassword: string;
}
