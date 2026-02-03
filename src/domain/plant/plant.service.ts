import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  async setterNutrient(nutrientDto: PlantNutrientDto) {
    this.logger.log('📩 setterNutrient 호출됨');
    this.logger.debug(`   - DTO: ${JSON.stringify(nutrientDto)}`);

    const zone = await this.zoneRepository.findOneBy({
      zoneId: nutrientDto.zoneId,
    });
    this.logger.log(`   - zone 조회 결과: ${zone ? '존재함' : '없음'}`);

    if (!zone) {
      this.logger.warn(`⚠ Aborted: 없는 zone (${nutrientDto.zoneId})`);
      throw new BadRequestException('없는 zone');
    }

    zone.nutrient = nutrientDto.nutrientsRate;
    this.logger.log(`   - zone.nutrient 설정: ${nutrientDto.nutrientsRate}`);

    const saved = await this.zoneRepository.save(zone);
    this.logger.log('✅ Nutrient 저장 완료', saved);
    return saved;
  }

  async fogCycleSetter(fogCycleDto: PlantFogCycleDto) {
    this.logger.log('📩 fogCycleSetter 호출됨');
    this.logger.debug(`   - DTO: ${JSON.stringify(fogCycleDto)}`);

    const zone = await this.zoneRepository.findOneBy({
      zoneId: fogCycleDto.zoneId,
    });
    this.logger.log(`   - zone 조회 결과: ${zone ? '존재함' : '없음'}`);

    if (!zone) {
      this.logger.warn(
        `⚠ Aborted: 없는 zone for fog cycle (${fogCycleDto.zoneId})`,
      );
      throw new BadRequestException('없는 zone');
    }

    zone.autoFogOnTime = fogCycleDto.onInterval;
    zone.autoFogOffTime = fogCycleDto.offInterval;
    zone.autoFogMode = true;
    this.logger.log(
      `   - auto fog 설정 변경: on=${fogCycleDto.onInterval}, off=${fogCycleDto.offInterval}`,
    );

    const saved = await this.zoneRepository.save(zone);
    this.logger.log('✅ Fog cycle 저장 완료', saved);
    return saved;
  }

  async fogPowerSetter(fogPowerDto: PlantFogPowerDto) {
    this.logger.log('📩 fogPowerSetter 호출됨');
    this.logger.debug(`   - DTO: ${JSON.stringify(fogPowerDto)}`);

    const zone = await this.zoneRepository.findOneBy({
      zoneId: fogPowerDto.zoneId,
    });
    this.logger.log(`   - zone 조회 결과: ${zone ? '존재함' : '없음'}`);

    if (!zone) {
      this.logger.warn(
        `⚠ Aborted: 없는 zone for fog power (${fogPowerDto.zoneId})`,
      );
      throw new BadRequestException('없는 zone');
    }

    zone.autoFogMode = false;
    zone.fogPower = fogPowerDto.power;
    this.logger.log(`   - fog power 설정: ${fogPowerDto.power}`);

    const saved = await this.zoneRepository.save(zone);
    this.logger.log('✅ Fog power 저장 완료', saved);
    return saved;
  }
}
