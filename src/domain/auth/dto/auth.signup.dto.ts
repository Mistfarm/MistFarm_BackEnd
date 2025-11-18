import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupDto {
  @IsString()
  @Matches(/^[가-힣a-zA-Z]{2,25}$/, {
    message:
      '이름은 공백, 특수문자, 숫자 없이 2자 이상 25자 이하로 입력해주세요.',
  })
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
