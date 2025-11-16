import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLogoutDto {
  @IsString()
  @ApiProperty({ description: '리프레쉬 토큰' })
  refreshToken: string;
}
