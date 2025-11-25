import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ZoneRegistrationDto } from '../dto/zone.registration.dto';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { ZoneEntity } from '../../../DB/entity/zone.entity';

@Injectable()
export class ZoneRegistrationService {
  private readonly logger = new Logger(ZoneRegistrationService.name);

  constructor(
    private readonly zoneRepo: ZoneRepository,
    private readonly dataSource: DataSource,
  ) {}

  async registerZone(
    userId: string,
    zoneRegistrationDto: ZoneRegistrationDto,
  ): Promise<ZoneEntity> {
    const { zoneId, zonePassword } = zoneRegistrationDto;

    this.logger.log(`User ${userId} attempting to register zone ${zoneId}`);

    return await this.dataSource.transaction(async (manager) => {
      const zoneRepo = manager.getRepository(ZoneEntity);

      // 인증용 zone 찾기 (동시성 제어)
      const zone = await zoneRepo.findOne({
        where: { zoneId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!zone) {
        this.logger.warn(`Zone ${zoneId} not found`);
        throw new NotFoundException('존재하지 않는 구획입니다.');
      }

      // 이미 누가 사용 중인지 체크
      if (zone.userId) {
        this.logger.warn(
          `Zone ${zoneId} already registered to user ${zone.userId}`,
        );
        throw new ConflictException('이미 다른 사용자가 등록한 구획입니다.');
      }

      // 비밀번호 검증 (해시 비교)
      const isPasswordValid = await bcrypt.compare(
        zonePassword,
        zone.zonePassword,
      );

      if (!isPasswordValid) {
        this.logger.warn(
          `Invalid password attempt for zone ${zoneId} by user ${userId}`,
        );
        throw new UnauthorizedException('구획 비밀번호가 올바르지 않습니다.');
      }

      // user_id 업데이트
      zone.userId = userId;

      const savedZone = await zoneRepo.save(zone);

      this.logger.log(
        `Zone ${zoneId} successfully registered to user ${userId}`,
      );

      return savedZone;
    });
  }

}
