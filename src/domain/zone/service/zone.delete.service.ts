import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { DeviceRepository } from '../../../DB/repository/device.repository';
import { ZoneDeleteDto } from '../dto/zone.delete.dto';

@Injectable()
export class ZoneDeleteService {
  constructor(
    private readonly zoneRepo: ZoneRepository,
    private readonly deviceRepo: DeviceRepository,
  ) {}

  async deleteZone(userId: string, dto: ZoneDeleteDto): Promise<void> {
    // 삭제할 구획 조회
    const zone = await this.zoneRepo.findOne({
      where: { zoneId: dto.zoneId },
    });

    if (!zone) {
      throw new NotFoundException('해당 구획을 찾을 수 없습니다.');
    }

    if (zone.userId !== userId) {
      throw new ForbiddenException('이 구획을 삭제할 권한이 없습니다.');
    }

    // 사용자 소유의 "사용하지 않는 기기 모음" 구획 찾기
    const unusedZone = await this.zoneRepo.findUnusedZoneByUserId(userId);
    if (!unusedZone) {
      throw new NotFoundException(
        '사용하지 않는 기기 모음 구획을 찾을 수 없습니다.',
      );
    }

    // 삭제되는 구획의 기기들을 "미사용 구획"으로 이동
    await this.deviceRepo.moveDevicesToZone(dto.zoneId, unusedZone.zoneId);

    // 실제 구획 삭제
    const deleted = await this.zoneRepo.deleteByZoneIdAndUserId(
      dto.zoneId,
      userId,
    );

    if (!deleted) {
      throw new NotFoundException('구획을 삭제하지 못했습니다.');
    }
  }
}
