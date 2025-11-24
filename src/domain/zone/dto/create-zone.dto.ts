import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PLANT_TYPES, PlantType } from '../plant.types';

export class CreateZoneDto {
  @IsString()
  userId: string;

  @IsString()
  zoneName: string;

  @IsOptional()
  @IsEnum(PLANT_TYPES, { message: 'plants는 PlantType 중 하나여야 합니다.' })
  plants?: PlantType;

  @IsOptional()
  autoFogMode?: boolean;

  @IsOptional()
  autoFogOnTime?: string;

  @IsOptional()
  autoFogOffTime?: string;

  @IsOptional()
  fogPower?: boolean;

  @IsOptional()
  nutrient?: number;
}
