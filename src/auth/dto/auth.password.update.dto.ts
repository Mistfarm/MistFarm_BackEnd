import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPasswordUpdateDto {
  @IsString()
  @ApiProperty({ example: 'test123', description: '현제 비밀번호' })
  oldPassword: string;

  @IsString()
  @ApiProperty({ example: 'test1234', description: '새로운 비밀번호' })
  newPassword: string;
}
