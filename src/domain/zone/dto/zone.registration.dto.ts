import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ZoneRegistrationDto {
  @IsString()
  @IsNotEmpty()
  zoneAuthId: string;

  @IsString()
  @IsNotEmpty({ message: 'zone_password는 필수입니다.' })
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
  zonePw: string;
}
