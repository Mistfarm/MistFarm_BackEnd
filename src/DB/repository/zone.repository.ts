import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ZoneEntity } from '../entity/zone.entity';

@Injectable()
export class ZoneRepository extends Repository<ZoneEntity> {
  constructor(private dataSource: DataSource) {
    super(ZoneEntity, dataSource.createEntityManager());
  }

  // 사용자의 모든 구획 조회
  async findByUserId(userId: string): Promise<ZoneEntity[]> {
    return this.find({ where: { userId } });
  }

  // 특정 사용자의 구획 ID로 조회
  async findByZoneIdAndUserId(
    userId: string,
    zoneId: string,
  ): Promise<ZoneEntity | null> {
    return this.findOne({ where: { userId: userId, zoneId: zoneId } });
  }

  // 구획 생성
  async createZone(zone: ZoneEntity): Promise<ZoneEntity> {
    const newZone = this.create({
      userId: zone.userId,
      zoneName: zone.zoneName,
      plants: zone.plants,
      autoFogMode: zone.autoFogMode,
      autoFogOnTime: zone.autoFogOnTime,
      autoFogOffTime: zone.autoFogOffTime,
      fogPower: zone.fogPower,
      nutrient: zone.nutrient,
    });
    return this.save(newZone);
  }

  // zoneId와 userId로 소유자 확인 후 삭제
  async deleteByZoneIdAndUserId(
    zoneId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.delete({ zoneId, userId });
    return (result.affected ?? 0) > 0;
  }

  // 같은 사용자가 이미 같은 이름의 구획을 가지고 있는지 확인
  async existsByZoneNameAndUserId(
    userId: string,
    zoneName: string,
  ): Promise<boolean> {
    const count = await this.count({
      where: { userId, zoneName },
    });
    return count > 0;
  }

  // 같은 사용자의 구획 중 같은 이름이 있는지 확인하고 해당 구획 반환
  async findByZoneNameAndUserId(
    userId: string,
    zoneName: string,
  ): Promise<ZoneEntity | null> {
    return this.findOne({
      where: { userId, zoneName },
    });
  }
}
