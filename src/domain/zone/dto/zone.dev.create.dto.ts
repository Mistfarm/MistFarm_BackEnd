import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

interface DevCreateSnakeCaseInput {
  zone_auth_id?: string;
  zone_password?: string;
  zone_name?: string;
}

export class ZoneDevCreateDto {
  @IsString()
  @Transform(
    ({ value, obj }: { value?: string; obj: DevCreateSnakeCaseInput }) =>
      value || obj.zone_auth_id,
  )
  zoneAuthId: string;

  @IsString()
  @Transform(
    ({ value, obj }: { value?: string; obj: DevCreateSnakeCaseInput }) =>
      value || obj.zone_password,
  )
  zonePassword: string;

  @IsString()
  @Transform(
    ({ value, obj }: { value?: string; obj: DevCreateSnakeCaseInput }) =>
      value || obj.zone_name,
  )
  zoneName: string;
}
