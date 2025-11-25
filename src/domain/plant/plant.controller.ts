import { Body, Controller, Put } from '@nestjs/common';
import { PlantService } from './plant.service';
import { PlantNutrientDto } from './dto/plant.nutrient.dto';

@Controller()
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
  @Put('/zone/setting/nutrient')
  async setterNutrient(@Body() nutrientDto: PlantNutrientDto) {
    await this.plantService.setterNutrient(nutrientDto);
  }
}
