import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class ZoneCreateDto {
  @IsString()
  @IsNotEmpty()
  zoneName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deviceIds: string[];
}
