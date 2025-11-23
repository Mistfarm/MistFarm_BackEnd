import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Zone } from './zone.entity';

@Injectable()
export class ZoneRepository extends Repository<Zone> {
  constructor(private dataSource: DataSource) {
    super(Zone, dataSource.createEntityManager());
  }

  // 구획 조회
  async findByUserId(userId: string): Promise<Zone[]> {
    return this.find({ where: { user_id: userId } });
  }

  // 구획 이름으로 조회
  async findByName(name: string): Promise<Zone | null> {
    return this.findOne({ where: { zone_name: name } });
  }

  // 구획 생성 함수
  async createZone(zone: Partial<Zone>): Promise<Zone> {
    const newZone = this.create(zone);
    return this.save(newZone);
  }

  // 구획 삭제 함수
  async deleteZone(zoneId: string): Promise<void> {
    await this.delete({ zone_id: zoneId });
  }
}
