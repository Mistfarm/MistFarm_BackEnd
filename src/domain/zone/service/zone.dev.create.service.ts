import {
  ConflictException,
  Injectable,
  Logger, NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ZoneRepository } from '../../../DB/repository/zone.repository';
import { ZoneEntity } from '../../../DB/entity/zone.entity';
import * as bcrypt from 'bcrypt';
import { ZoneDevCreateDto } from '../dto/zone.dev.create.dto';
import { ConfigService } from '@nestjs/config';
import { DeviceService } from '../../device/device.service';
import { DeviceRepository } from '../../../DB/repository/device.repository';
import { DeviceEntity } from '../../../DB/entity/device.entity';

@Injectable()
export class ZoneDevCreateService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly zoneRepo: ZoneRepository,
    private readonly deviceRepo: DeviceRepository,
    private readonly config: ConfigService,
  ) {}

  async createDevZone(
    userId: string,
    zoneCreateDto: ZoneDevCreateDto,
  ): Promise<ZoneEntity> {
    // 1. DEV 권한 확인
    const devKey = this.config.get<string>('DEV');
    if (devKey !== userId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    // 2. 중복 체크
    const existingZone = await this.zoneRepo.findOne({
      where: { zoneRegisterId: zoneCreateDto.zoneAuthId },
    });
    if (existingZone) {
      throw new ConflictException('이미 존재하는 구획 인증 ID입니다.');
    }

    // 3. 비밀번호 해시
    const hashedPassword = await bcrypt.hash(
      zoneCreateDto.zonePassword,
      this.SALT_ROUNDS,
    );

    // 4. 새 Zone 생성
    const newZone = this.zoneRepo.create({
      zoneRegisterId: zoneCreateDto.zoneAuthId,
      zonePassword: hashedPassword,
      zoneName: zoneCreateDto.zoneName,
      userId: devKey,
      isNotUsed: false,
    });

    const savedZone = await this.zoneRepo.save(newZone);

    // 5. deviceIds 처리
    if (zoneCreateDto.deviceIds?.length) {
      for (const deviceId of zoneCreateDto.deviceIds) {
        const device = await this.deviceRepo.findOne({ where: { deviceId } });

        if (!device) {
          throw new NotFoundException('존재하지 않는 기기가 있습니다.');
        }

        device.zoneId = savedZone.zoneId;
        await this.deviceRepo.save(device);
      }
    }

    return savedZone;
  }
}
