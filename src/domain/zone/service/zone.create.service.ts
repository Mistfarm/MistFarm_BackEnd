import { ConflictException, Injectable } from '@nestjs/common';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { ZoneEntity } from '../../../DB/entity/zone.entity';
import { ZoneCreateDto } from '../dto/zone.create.dto';

@Injectable()
export class ZoneCreateService {
  constructor(private readonly zoneRepo: ZoneRepository) {}

  async createZone(
    userId: string,
    zoneCreateDto: ZoneCreateDto,
  ): Promise<ZoneEntity> {
    // 같은 사용자의 중복된 zone 이름 체크
    const existsByName = await this.zoneRepo.existsByZoneNameAndUserId(
      userId,
      zoneCreateDto.zoneName,
    );

    if (existsByName) {
      throw new ConflictException('이미 존재하는 구획 이름입니다.');
    }

    // Zone 생성 (zoneId, zonePassword는 null)
    const newZone = this.zoneRepo.create({
      zoneName: zoneCreateDto.zoneName,
      userId,
    });
    await this.zoneRepo.save(newZone);

    return newZone;
  }
}
