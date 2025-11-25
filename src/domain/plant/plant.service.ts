import { BadRequestException, Injectable } from '@nestjs/common';
import { PlantNutrientDto } from './dto/plant.nutrient.dto';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { PlantFogCycleDto } from './dto/plant.fog.cycle.dto';
import { PlantFogPowerDto } from './dto/plant.fog.power.dto';

@Injectable()
export class PlantService {
  constructor(private readonly zoneRepository: ZoneRepository) {}
  async setterNutrient(nutrientDto: PlantNutrientDto) {
    const zone = await this.zoneRepository.findOneBy({
      zoneId: nutrientDto.zoneId,
    });
    if (!zone) throw new BadRequestException('없는 zone');
    zone.nutrient = nutrientDto.nutrientsRate;
    void this.zoneRepository.save(zone);
  }
  async fogCycleSetter(fogCycleDto: PlantFogCycleDto) {
    const zone = await this.zoneRepository.findOneBy({
      zoneId: fogCycleDto.zoneId,
    });
    if (!zone) throw new BadRequestException('없는 zone');
    zone.autoFogOnTime = fogCycleDto.onInterval;
    zone.autoFogOffTime = fogCycleDto.offInterval;
    zone.autoFogMode = true;
    void this.zoneRepository.save(zone);
  }
  async fogPowerSetter(fogPowerDto: PlantFogPowerDto) {
    const zone = await this.zoneRepository.findOneBy({
      zoneId: fogPowerDto.zoneId,
    });
    if (!zone) throw new BadRequestException('없는 zone');
    zone.autoFogMode = false;
    zone.fogPower = fogPowerDto.power;
    void this.zoneRepository.save(zone);
  }
}
