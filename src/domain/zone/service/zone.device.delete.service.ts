import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DeviceRepository } from '../../../DB/repository/device.repository';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { DeviceDeleteByZoneDto } from '../dto/zone.device.delete.dto';

@Injectable()
export class DeviceDeleteByZoneService {
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly zoneRepo: ZoneRepository,
  ) {}

  async deleteDevices(
    userId: string,
    dto: DeviceDeleteByZoneDto,
  ): Promise<void> {
    // zone 주인이 현재 유저인지 확인
    const zone = await this.zoneRepo.findOne({
      where: { zoneId: dto.zoneId },
      select: ['userId'],
    });

    if (!zone) {
      throw new NotFoundException('존재하지 않는 구획입니다.');
    }

    if (zone.userId !== userId) {
      throw new ForbiddenException(
        '해당 구획의 소유자만 기기를 삭제할 수 있습니다.',
      );
    }

    // 삭제 실행
    const deletedCount = await this.deviceRepo.deleteByZoneAndDeviceIds(
      dto.zoneId,
      dto.deviceIds,
    );

    if (deletedCount === 0) {
      throw new NotFoundException(
        '삭제할 기기가 존재하지 않거나 구획과 일치하지 않습니다.',
      );
    }
  }
}
