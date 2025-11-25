import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { ZoneEntity } from '../../../DB/entity/zone.entity';
import { ZoneCreateDto } from '../dto/zone.create.dto';
import { DeviceRepository } from '../../../DB/repository/device.repository';

@Injectable()
export class ZoneCreateService {
  constructor(
    private readonly zoneRepo: ZoneRepository,
    private readonly deviceRepo: DeviceRepository,
  ) {}

  async createZone(
    userId: string,
    zoneCreateDto: ZoneCreateDto,
  ): Promise<ZoneEntity> {
    // 1. 같은 사용자의 중복된 zone 이름 체크
    const existsByName = await this.zoneRepo.existsByZoneNameAndUserId(
      userId,
      zoneCreateDto.zoneName,
    );

    if (existsByName) {
      throw new ConflictException('이미 존재하는 구획 이름입니다.');
    }

    // 2. Zone 생성
    const newZone = this.zoneRepo.create({
      zoneName: zoneCreateDto.zoneName,
      userId,
    });
    await this.zoneRepo.save(newZone);

    // 3. 기기 등록/변경 권한 체크
    if (zoneCreateDto.deviceIds?.length) {
      const zone = await this.zoneRepo.findByZoneNameAndUserId(
        userId,
        '사용하지 않는 기기 모음',
      );

      if (!zone) {
        throw new NotFoundException();
      }

      const devices = await this.deviceRepo.findByZoneId(zone.zoneId);

      // zoneId 변경
      await this.deviceRepo.save(
        devices.map((device) => {
          device.zoneId = newZone.zoneId;
          return device;
        }),
      );
    }

    return newZone;
  }
}
