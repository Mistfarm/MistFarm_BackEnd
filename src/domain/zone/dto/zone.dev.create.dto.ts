import {
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ZoneDevCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'zone_auth_id는 필수입니다.' })
  zoneAuthId: string;

  @IsString()
  @IsNotEmpty({ message: 'zone_password는 필수입니다.' })
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
  zonePassword: string;

  @IsString()
  @IsNotEmpty({ message: 'zone_name은 필수입니다.' })
  @MaxLength(15, { message: '구획 이름은 최대 15자까지 가능합니다.' })
  zoneName: string;

  @IsArray()
  @IsNotEmpty({ message: 'zone_name은 필수입니다.' })
  @IsNumber({}, { each: true })
  deviceIds: number[];
}
