import { Body, Controller, Put } from '@nestjs/common';
import { PlantService } from './plant.service';
import { PlantNutrientDto } from './dto/plant.nutrient.dto';

@Controller()
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
  @Put('/zone/setting/nutrient')
  async setterNutrient(@Body() nutrientDto: PlantNutrientDto) {
    await this.plantService.setterNutrient(nutrientDto);
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorater/decorator.user';
import { UserEntity } from '../../DB/entity/user.entity';
import { ZonePlantSelectDto } from './dto/plant.select.dto';
import {
  ZonePlantServiceByHannah,
} from './service/plant.select.service';
import { AuthJwtGuard } from '../auth/jwt/auth.jwt.guard';

@Controller('plant')
export class PlantController {
  constructor(
    private readonly plantService: ZonePlantServiceByHannah,
  ) {}

  @Post('/zone/plant')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthJwtGuard)
  async selectPlant(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZonePlantSelectDto,
  ) {
    return await this.plantService.selectPlant(user.user_id, dto);
  }
}
