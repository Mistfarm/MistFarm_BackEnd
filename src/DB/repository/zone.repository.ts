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

  // 특정 사용자의 구획 이름으로 조회
  async findByZoneIdAndUserId(
    userId: string,
    zoneId: string,
  ): Promise<ZoneEntity | null> {
    return this.findOne({ where: { userId: userId, id: zoneId } });
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

  // 구획 삭제
  async deleteZone(zoneId: string): Promise<boolean> {
    const result = await this.delete({ id: zoneId });
    return (result.affected ?? 0) > 0;
  }

  // 구획 존재 여부 확인
  async existsByNameAndUserId(
    userId: string,
    zoneName: string,
  ): Promise<boolean> {
    return await this.exist({
      where: { userId, zoneName },
    });
  }
}
