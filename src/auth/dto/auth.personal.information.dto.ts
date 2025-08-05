import { ApiProperty } from '@nestjs/swagger';

export class AuthPersonalInformationDto {
  @ApiProperty({ example: '김먼지', description: '이름' })
  name: string;

  @ApiProperty({ example: 'test123@maile.com', description: '사용자 이메일' })
  email: string;
}
