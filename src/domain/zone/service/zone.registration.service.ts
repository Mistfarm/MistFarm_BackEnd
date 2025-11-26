import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ZoneRegistrationDto } from '../dto/zone.registration.dto';
import { ZoneEntity } from '../../../DB/entity/zone.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZoneRegistrationService {
  constructor(
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async registerZone(
    userId: string,
    zoneRegistrationDto: ZoneRegistrationDto,
  ): Promise<ZoneEntity> {
    const { zoneAuthId, zonePw } = zoneRegistrationDto;
    return await this.dataSource.transaction(async (manager) => {
      const zoneRepo = manager.getRepository(ZoneEntity);

      // zoneRegisterId로 조회
      const zone = await zoneRepo.findOne({
        where: { zoneRegisterId: zoneAuthId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!zone) {
        throw new NotFoundException('존재하지 않는 구획입니다.');
      }

      // 이미 다른 사용자가 등록했는지 체크
      if (zone.userId) {
        throw new ConflictException('이미 다른 사용자가 등록한 구획입니다.');
      }

      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(zonePw, zone.zonePassword);

      if (!isPasswordValid) {
        throw new UnauthorizedException('구획 비밀번호가 올바르지 않습니다.');
      }

      // userId 업데이트 (DEV → 실제 사용자)
      zone.userId = userId;
      zone.isNotUsed = false;

      return await zoneRepo.save(zone);
    });
  }
}
