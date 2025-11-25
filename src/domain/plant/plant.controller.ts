import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorater/decorator.user';
import { UserEntity } from '../../DB/entity/user.entity';
import { ZonePlantSelectDto } from './dto/plant.select.dto';
import {
  ZonePlantServiceByHannah,
} from './service/plant.select.service';

@Controller('plant')
export class PlantController {
  constructor(
    private readonly plantService: ZonePlantServiceByHannah,
  ) {}

  @Post('/zone/plant')
  @HttpCode(HttpStatus.OK)
  async selectPlant(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZonePlantSelectDto,
  ) {
    return await this.plantService.selectPlant(user.user_id, dto);
  }
}
