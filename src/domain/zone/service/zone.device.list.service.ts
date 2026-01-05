import { Injectable, ForbiddenException } from '@nestjs/common';
import { DeviceRepository } from '../../../DB/repository/device.repository';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { DevicesResponse, DeviceSummaryResponse } from '../dto/device.list.dto';

@Injectable()
export class ZoneDeviceListService {
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly zoneRepo: ZoneRepository,
  ) {}

  async createDevices() {
    
  }

  async getZoneDevicesByZone(
    userId: string,
    zoneId: string,
  ): Promise<DevicesResponse> {
    // 해당 zone이 user 소유인지 확인
    const zone = await this.zoneRepo.findByZoneIdAndUserId(userId, zoneId);
    if (!zone) {
      throw new ForbiddenException('해당 구획에 대한 접근 권한이 없습니다.');
    }

    // zone에 속한 device 조회
    const devices = await this.deviceRepo.findByZoneId(zoneId);

    // DTO 변환
    const deviceList: DeviceSummaryResponse[] = devices.map((d) => ({
      devicesId: d.deviceId,
      name: d.deviceName,
    }));

    return { devices: deviceList };
  }
}
