import { ApiProperty } from '@nestjs/swagger';

export class AuthPersonalInformationDto {
  @ApiProperty({ example: '김먼지', description: '이름' })
  name: string;

  @ApiProperty({ example: 'test123', description: '사용자 아이디' })
  id: string;
}
