import { ForbiddenException, Injectable } from '@nestjs/common';
import { ZonePlantSelectDto } from '../dto/plant.select.dto';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import {
  ZoneSettingQueryDto,
  ZoneSettingResponseAuto,
  ZoneSettingResponseManual,
} from '../dto/plant.zone-setting.dto';
import { DeviceRepository } from '../../../DB/repository/device.repository';

@Injectable()
export class ZonePlantServiceByHannah {
  constructor(
    private readonly zoneRepo: ZoneRepository,
    private readonly deviceRepo: DeviceRepository,
  ) {}

  async selectPlant(userId: string, dto: ZonePlantSelectDto) {
    // 1. zone 조회 (사용자 검증)
    const zone = await this.zoneRepo.findOne({
      where: { zoneId: dto.zoneId, userId },
    });

    if (!zone) {
      throw new ForbiddenException('해당 구획에 접근할 수 없습니다.');
    }

    // 2. plant 업데이트
    zone.plants = dto.plant;
    await this.zoneRepo.save(zone);

    return { success: true, plant: dto.plant };
  }x
}

