import {
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PlantNutrientDto } from './dto/plant.nutrient.dto';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { PlantFogCycleDto } from './dto/plant.fog.cycle.dto';
import { PlantFogPowerDto } from './dto/plant.fog.power.dto';

@Injectable()
export class PlantService {
  private readonly logger = new Logger(PlantService.name);

  constructor(private readonly zoneRepository: ZoneRepository) {
    this.logger.log('🌱 PlantService 초기화됨');
  }

  async setterNutrient(userId: string, nutrientDto: PlantNutrientDto) {
    // userId 추가
    this.logger.log('📩 setterNutrient 호출됨');
    this.logger.debug(`   - userId: ${userId}`);
    this.logger.debug(`   - DTO: ${JSON.stringify(nutrientDto)}`);

    // 사용자 권한 검증
    const zone = await this.zoneRepository.findOne({
      where: { zoneId: nutrientDto.zoneId, userId },
    });

    this.logger.log(`   - zone 조회 결과: ${zone ? '존재함' : '없음'}`);

    if (!zone) {
      this.logger.warn(
        `⚠ Aborted: 권한 없음 또는 없는 zone (${nutrientDto.zoneId})`,
      );
      throw new ForbiddenException('해당 구획에 접근할 수 없습니다.');
    }

    zone.nutrient = nutrientDto.nutrientsRate;
    this.logger.log(`   - zone.nutrient 설정: ${nutrientDto.nutrientsRate}`);

    const saved = await this.zoneRepository.save(zone);
    this.logger.log('✅ Nutrient 저장 완료');
    return saved;
  }

  async fogCycleSetter(userId: string, fogCycleDto: PlantFogCycleDto) {
    // userId 추가
    this.logger.log('📩 fogCycleSetter 호출됨');
    this.logger.debug(`   - userId: ${userId}`);
    this.logger.debug(`   - DTO: ${JSON.stringify(fogCycleDto)}`);

    // 사용자 권한 검증
    const zone = await this.zoneRepository.findOne({
      where: { zoneId: fogCycleDto.zoneId, userId },
    });

    this.logger.log(`   - zone 조회 결과: ${zone ? '존재함' : '없음'}`);

    if (!zone) {
      this.logger.warn(
        `⚠ Aborted: 권한 없음 또는 없는 zone (${fogCycleDto.zoneId})`,
      );
      throw new ForbiddenException('해당 구획에 접근할 수 없습니다.');
    }

    zone.autoFogOnTime = fogCycleDto.onInterval;
    zone.autoFogOffTime = fogCycleDto.offInterval;
    zone.autoFogMode = true;
    this.logger.log(
      `   - auto fog 설정 변경: on=${fogCycleDto.onInterval}, off=${fogCycleDto.offInterval}`,
    );

    const saved = await this.zoneRepository.save(zone);
    this.logger.log('✅ Fog cycle 저장 완료');
    return saved;
  }

  async fogPowerSetter(userId: string, fogPowerDto: PlantFogPowerDto) {
    // userId 추가
    this.logger.log('📩 fogPowerSetter 호출됨');
    this.logger.debug(`   - userId: ${userId}`);
    this.logger.debug(`   - DTO: ${JSON.stringify(fogPowerDto)}`);

    // 사용자 권한 검증
    const zone = await this.zoneRepository.findOne({
      where: { zoneId: fogPowerDto.zoneId, userId },
    });

    this.logger.log(`   - zone 조회 결과: ${zone ? '존재함' : '없음'}`);

    if (!zone) {
      this.logger.warn(
        `⚠ Aborted: 권한 없음 또는 없는 zone (${fogPowerDto.zoneId})`,
      );
      throw new ForbiddenException('해당 구획에 접근할 수 없습니다.');
    }

    zone.autoFogMode = false;
    zone.fogPower = fogPowerDto.power;
    this.logger.log(`   - fog power 설정: ${fogPowerDto.power}`);

    const saved = await this.zoneRepository.save(zone);
    this.logger.log('✅ Fog power 저장 완료');
    return saved;
  }
}
