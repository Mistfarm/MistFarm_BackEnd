import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: 'test123', description: '사용자 아이디' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'password123', description: '비밀번호' })
  password: string;
}
