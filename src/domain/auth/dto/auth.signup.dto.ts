import { IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupDto {
  @IsString()
  @ApiProperty({ example: '김먼지', description: '이름' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'test123@maile.com', description: '사용자 이메일' })
  email: string;

  @IsString()
  @Matches(/^[^\s]{8,25}$/, {
    message: '비밀번호는 공백 없이 8자 이상 25자 이하로 입력해주세요.',
  })
  @ApiProperty({ example: 'password123', description: '비밀번호' })
  password: string;
}
