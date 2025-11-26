import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { DeviceRepository } from '../../DB/repository/device.repository';

@Module({
  providers: [DeviceRepository],
  controllers: [NoticeController],
})
export class NoticeModule {}