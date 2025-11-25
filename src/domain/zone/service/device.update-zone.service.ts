import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DeviceRepository } from '../../../DB/repository/device.repository';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { DeviceUpdateZoneDto } from '../dto/device.update-zone.dto';

@Injectable()
export class DeviceUpdateZoneService {
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly zoneRepo: ZoneRepository,
  ) {}

  async updateDeviceZone(userId: string, dto: DeviceUpdateZoneDto) {
    // 1. target zone 검증 (사용하지 않는 구획인지, isNotUsed=true)
    const targetZone = await this.zoneRepo.findOne({
      where: {
        zoneId: dto.zoneId,
        userId,
        zoneName: '사용하지 않는 기기 모음',
        isNotUsed: true,
      },
    });

    if (!targetZone) {
      throw new ForbiddenException(
        '해당 구획으로 기기를 이동할 권한이 없습니다.',
      );
    }

    // 2. deviceIds 존재 확인
    const devices = await this.deviceRepo.findDevicesByIds(dto.deviceNames);
    if (!devices.length) {
      throw new NotFoundException('이동할 기기가 존재하지 않습니다.');
    }

    // 3. 이동 가능 조건 검증: devices가 현재 targetZone이 아닌 구획에 속해야 함
    const invalidDevices = devices.filter(
      (d) => d.zoneId === dto.zoneId,
    );
    if (invalidDevices.length === devices.length) {
      throw new ForbiddenException('모든 기기가 이미 해당 구획에 있습니다.');
    }

    // 4. zoneId 변경
    await this.deviceRepo.updateZoneForUnusedDevices(
      devices.map((d) => d.deviceName),
      dto.zoneId,
    );
  }
}
