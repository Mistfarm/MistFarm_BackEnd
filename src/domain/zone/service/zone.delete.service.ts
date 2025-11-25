import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { ZoneDeleteDto } from '../dto/zone.delete.dto';

@Injectable()
export class ZoneDeleteService {
  constructor(private readonly zoneRepo: ZoneRepository) {}

  async deleteZone(userId: string, dto: ZoneDeleteDto): Promise<void> {
    const deleted = await this.zoneRepo.deleteByZoneIdAndUserId(
      dto.zoneId,
      userId,
    );

    if (!deleted) {
      throw new ForbiddenException('해당 구획을 삭제할 수 없습니다.');
    }
  }
}