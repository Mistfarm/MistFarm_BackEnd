  import { IsUUID } from 'class-validator';

export class ZoneDeleteDto {
  @IsUUID('4')
  zoneId: string;
}
