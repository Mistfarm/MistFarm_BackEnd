import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthPersonalInformationDto {
  @IsString()
  @ApiProperty({ example: '김먼지', description: '이름' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'test123', description: '사용자 아이디' })
  id: string;
}
