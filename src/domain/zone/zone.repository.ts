import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Zone } from './zone.entity';
import { CreateZoneDto } from './dto/create-zone.dto';

@Injectable()
export class ZoneRepository extends Repository<Zone> {
  constructor(private dataSource: DataSource) {
    super(Zone, dataSource.createEntityManager());
  }

  // 사용자의 모든 구획 조회
  async findByUserId(userId: string): Promise<Zone[]> {
    return this.find({ where: { userId } });
  }

  // 특정 사용자의 구획 이름으로 조회
  async findByNameAndUserId(
    userId: string,
    zoneName: string,
  ): Promise<Zone | null> {
    return this.findOne({ where: { userId, zoneName } });
  }

  // 구획 생성
  async createZone(dto: CreateZoneDto): Promise<Zone> {
    const newZone = this.create({
      userId: dto.userId,
      zoneName: dto.zoneName,
      plants: dto.plants ?? 'none',
      autoFogMode: dto.autoFogMode ?? false,
      autoFogOnTime: dto.autoFogOnTime ?? '00:00:00',
      autoFogOffTime: dto.autoFogOffTime ?? '00:00:00',
      fogPower: dto.fogPower ?? false,
      nutrient: dto.nutrient ?? 0,
    });
    return this.save(newZone);
  }

  // 구획 삭제
  async deleteZone(zoneId: string): Promise<boolean> {
    const result = await this.delete({ zoneId });
    return (result.affected ?? 0) > 0;
  }

  // 구획 존재 여부 확인
  async existsByNameAndUserId(
    userId: string,
    zoneName: string,
  ): Promise<boolean> {
    const count = await this.count({ where: { userId, zoneName } });
    return count > 0;
  }
}
