import { Injectable, NotFoundException } from '@nestjs/common';
import { GrowthReportDto } from './dto/growth.report.dto';
import { DeviceRepository } from '../../DB/repository/device.repository';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { AllZonesDto, ZoneDto } from './dto/all.zones.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly zoneRepository: ZoneRepository,
  ) {}
  async growthReport(growthReportDto: GrowthReportDto) {
    await this.deviceRepository.saveGrowthLevel(
      growthReportDto.deviceId,
      growthReportDto.growthLevel,
    );
  }

  async findPlant(zoneId: string) {
    const zone = await this.zoneRepository.findOneBy({ zoneId });
    if (!zone) throw new NotFoundException('zoneId를 찾을 수 없음');
    return { plant_name: zone.plants };
  }

  async findAllZones(): Promise<AllZonesDto> {
    const zoneEntity = await this.zoneRepository.find();
    const zonesDto: ZoneDto[] = await Promise.all(
      zoneEntity.map(async (zone) => {
        const devices = await this.deviceRepository.findByZoneId(zone.zoneId);
        const devicesDto = devices.map((device) => device.deviceId);
        return { zoneId: zone.zoneId, devices: devicesDto };
      }),
    );
    return { zones: zonesDto };
  }
}
