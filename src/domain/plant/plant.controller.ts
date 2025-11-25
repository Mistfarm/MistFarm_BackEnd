import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorater/decorator.user';
import { UserEntity } from '../../DB/entity/user.entity';
import { ZonePlantSelectDto } from './dto/plant.select.dto';
import {
  ZonePlantServiceByHannah,
} from './service/plant.select.service';
import { AuthJwtGuard } from '../auth/jwt/auth.jwt.guard';
import { ZoneSettingQueryDto } from './dto/plant.zone-setting.dto';
import { ZoneModeUpdateDto } from './dto/ZoneModeUpdateDto';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: ZonePlantServiceByHannah) {}

  @Post('/zone/plant')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthJwtGuard)
  async selectPlant(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZonePlantSelectDto,
  ) {
    return await this.plantService.selectPlant(user.user_id, dto);
  }

  @UseGuards(AuthJwtGuard)
  @Get('/zone/setting')
  @HttpCode(HttpStatus.OK)
  async getZoneSetting(
    @CurrentUser() user: UserEntity,
    @Query() query: ZoneSettingQueryDto,
  ) {
    return this.plantService.getZoneSetting(user.user_id, query);
  }

  @UseGuards(AuthJwtGuard)
  @Put('/zone/setting/mode')
  @HttpCode(HttpStatus.OK)
  async updateFogMode(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneModeUpdateDto,
  ) {
    await this.plantService.updateMode(user.user_id, dto);
    return {}; // body 비워도 OK
  }
}
