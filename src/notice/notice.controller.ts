import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { NoticeDto } from './dto/notice.dto';

@Controller('notice')
export class NoticeController {
  @ApiOkResponse({ type: [NoticeDto] })
  @ApiBearerAuth()
  @Get('/notifications')
  async getNotifications() {}
}
