import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupDto {
  @IsString()
  @ApiProperty({ example: '김먼지', description: '이름' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'test123', description: '사용자 아이디' })
  id: string;

  @IsString()
  @Matches(/^[^\s]{8,25}$/, {
    message: '비밀번호는 공백 없이 8자 이상 25자 이하로 입력해주세요.',
  })
  @ApiProperty({ example: 'password123', description: '비밀번호' })
  password: string;
}
