import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { ZoneEntity } from '../../../DB/entity/zone.entity';
import * as bcrypt from 'bcrypt';
import { ZoneDevCreateDto } from '../dto/zone.dev.create.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZoneDevCreateService {
  private readonly logger = new Logger(ZoneDevCreateService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly zoneRepo: ZoneRepository,
    private readonly config: ConfigService,
  ) {}

  async createDevZone(
    userId: string,
    zoneCreateDto: ZoneDevCreateDto,
  ): Promise<ZoneEntity> {
    this.logger.log(`Creating new zone ${zoneCreateDto.zoneAuthId}`);

    // DEV 권한 확인
    const devKey = this.config.get<string>('DEV');

    if (devKey !== userId) {
      this.logger.warn(`Unauthorized zone creation attempt by user: ${userId}`);
      throw new UnauthorizedException('권한이 없습니다.');
    }

    // 중복 체크
    const existingZone = await this.zoneRepo.findOne({
      where: { zoneId: zoneCreateDto.zoneAuthId },
    });
    if (existingZone) {
      throw new ConflictException('이미 존재하는 구획 ID입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(
      zoneCreateDto.zonePassword,
      this.SALT_ROUNDS,
    );

    // 새 zone 생성
    const newZone = this.zoneRepo.create({
      zoneId: zoneCreateDto.zoneAuthId,
      zonePassword: hashedPassword,
      zoneName: zoneCreateDto.zoneName,
      userId: devKey,
    });
    const savedZone = await this.zoneRepo.save(newZone);

    this.logger.log(`Zone ${zoneCreateDto.zoneAuthId} created successfully`);

    return savedZone;
  }
}
