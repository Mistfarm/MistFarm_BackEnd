import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @IsEmail({}, { message: '유효한 이메일 형식이 아닙니다.' })
  @ApiProperty({ example: 'test123@maile.com', description: '사용자 이메일' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'password123', description: '비밀번호' })
  password: string;

  @IsString()
  @ApiProperty({ example: '김먼지', description: '이름' })
  name: string;
}
