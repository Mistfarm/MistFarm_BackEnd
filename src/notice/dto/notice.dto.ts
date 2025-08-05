import { ApiProperty } from '@nestjs/swagger';

export class NoticeDto {
  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '언제 울린 알람인지' })
  createdAt: Date;

  @ApiProperty({ description: '확인 했는지' })
  check: boolean;
}
