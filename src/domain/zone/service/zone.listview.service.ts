import { Injectable } from '@nestjs/common';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { ZonesResponse, ZoneSummaryResponse } from '../dto/zone.listview.dto';

@Injectable()
export class ZoneListViewService {
  constructor(private readonly zoneRepo: ZoneRepository) {}

  async getZoneList(userId: string): Promise<ZonesResponse> {
    // 1. 해당 유저의 구획만 조회
    const zones = await this.zoneRepo.find({
      where: { userId }, // userId 필터링
    });

    // 2. isNotUsed 구획 찾기
    const notUsedZone = zones.find((z) => z.isNotUsed);
    const otherZones = zones.filter((z) => !z.isNotUsed);

    // 3. DTO 변환
    const dtoList: ZoneSummaryResponse[] = [];

    if (notUsedZone) {
      dtoList.push({
        id: notUsedZone.zoneId,
        name: notUsedZone.zoneName,
        plant: notUsedZone.plants,
      });
    }

    otherZones.forEach((z) =>
      dtoList.push({
        id: z.zoneId,
        name: z.zoneName,
        plant: z.plants,
      }),
    );

    return { zones: dtoList };
  }
}
