import { ForbiddenException, Injectable } from '@nestjs/common';
import { ZonePlantSelectDto } from '../dto/plant.select.dto';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import {
  ZoneSettingResponseAuto,
  ZoneSettingResponseManual,
} from '../dto/plant.zone-setting.dto';
import { DeviceRepository } from '../../../DB/repository/device.repository';
import { ZoneModeUpdateDto } from '../dto/ZoneModeUpdateDto';

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
  }

  async getZoneSetting(
    userId: string,
    zoneId: string,
  ): Promise<ZoneSettingResponseAuto | ZoneSettingResponseManual> {
    // 1. zone 조회 + user 검증
    const zone = await this.zoneRepo.findOne({
      where: { zoneId, userId },
    });

    if (!zone) {
      throw new ForbiddenException('해당 구획에 접근할 수 없습니다.');
    }

    // 2. 해당 zone의 모든 device 조회
    const devices = await this.deviceRepo.find({
      where: { zoneId: zone.zoneId },
    });

    // 3. 각 device 속성 평균 계산 (반올림)
    const count = devices.length;
    const avgHumidity =
      count > 0
        ? Math.round(
            devices.reduce((sum, d) => sum + (d.humidity ?? 0), 0) / count,
          )
        : 0;
    const avgGrowth =
      count > 0
        ? Math.round(
            devices.reduce((sum, d) => sum + (d.growthLevel ?? 0), 0) / count,
          )
        : 0;
    const avgTemperature =
      count > 0
        ? Math.round(
            devices.reduce((sum, d) => sum + (d.temperature ?? 0), 0) / count,
          )
        : 0;

    // 4. 자동 모드
    if (zone.autoFogMode) {
      return {
        growthLevel: avgGrowth,
        humidity: avgHumidity,
        temperature: avgTemperature,
        plant: zone.plants,
        mode: true,
        onInterval: zone.autoFogOnTime,
        offInterval: zone.autoFogOffTime,
        nutrientsRate: zone.nutrient,
      };
    }

    // 5. 수동 모드
    return {
      growthLevel: avgGrowth,
      humidity: avgHumidity,
      temperature: avgTemperature,
      plant: zone.plants,
      mode: false,
      power: zone.fogPower,
      nutrientsRate: zone.nutrient,
    };
  }
  async updateMode(userId: string, dto: ZoneModeUpdateDto): Promise<void> {
    // 1. zone 조회 + user 검증
    const zone = await this.zoneRepo.findOne({
      where: { zoneId: dto.zoneId, userId },
    });

    if (!zone) {
      throw new ForbiddenException('해당 구획에 접근할 수 없습니다.');
    }

    // 2. 안개 공급 모드 업데이트
    zone.autoFogMode = dto.mode;
    await this.zoneRepo.save(zone);
  }
}
