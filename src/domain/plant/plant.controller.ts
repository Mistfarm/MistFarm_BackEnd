import { PlantService } from './plant.service';
import { PlantNutrientDto } from './dto/plant.nutrient.dto';
import {
  BadRequestException,
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
import { ZonePlantServiceByHannah } from './service/plant.select.service';
import { AuthJwtGuard } from '../auth/jwt/auth.jwt.guard';
import { ZoneModeUpdateDto } from './dto/ZoneModeUpdateDto';
import { PlantFogCycleDto } from './dto/plant.fog.cycle.dto';
import { PlantFogPowerDto } from './dto/plant.fog.power.dto';

@Controller()
export class PlantController {
  constructor(
    private readonly zonePlantServiceByHannah: ZonePlantServiceByHannah,
    private readonly plantService: PlantService,
  ) {
    console.log('🌱 PlantController 로드됨');
  }

  @Post('/zone/plant')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthJwtGuard)
  async selectPlant(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZonePlantSelectDto,
  ) {
    console.log('📩 [POST /zone/plant] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    const result = await this.zonePlantServiceByHannah.selectPlant(
      user.user_id,
      dto,
    );

    console.log('   👉 selectPlant 결과:', result);
    return result;
  }

  @UseGuards(AuthJwtGuard)
  @Get('/zone/setting')
  @HttpCode(HttpStatus.OK)
  async getZoneSetting(
    @CurrentUser() user: UserEntity,
    @Query('zone-id') zoneId: string,
  ) {
    console.log('📩 [GET /zone/setting] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - 쿼리:', zoneId);

    if (!zoneId) {
      throw new BadRequestException('zone-id 파라미터가 필요합니다.');
    }

    const result = await this.zonePlantServiceByHannah.getZoneSetting(
      user.user_id,
      zoneId,
    );

    console.log('   👉 getZoneSetting 결과:', result);
    return result;
  }

  @UseGuards(AuthJwtGuard)
  @Put('/zone/setting/mode')
  @HttpCode(HttpStatus.OK)
  async updateFogMode(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneModeUpdateDto,
  ) {
    console.log('📩 [PUT /zone/setting/mode] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - mode DTO:', dto);

    await this.zonePlantServiceByHannah.updateMode(user.user_id, dto);

    console.log('   👉 updateMode 완료');
    return {};
  }

  @UseGuards(AuthJwtGuard)
  @Put('/zone/setting/nutrient')
  @HttpCode(HttpStatus.OK)
  async setterNutrient(
    @CurrentUser() user: UserEntity,
    @Body() nutrientDto: PlantNutrientDto,
  ) {
    console.log('📩 [PUT /zone/setting/nutrient] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - nutrient DTO:', nutrientDto);

    const result = await this.plantService.setterNutrient(
      user.user_id, // ✅ userId 전달
      nutrientDto,
    );

    console.log('   👉 setterNutrient 결과:', result);
    return result;
  }

  @UseGuards(AuthJwtGuard)
  @Put('/zone/setting/fog-cycle')
  @HttpCode(HttpStatus.OK)
  async setterFogCycle(
    @CurrentUser() user: UserEntity,
    @Body() plantFogCycleDto: PlantFogCycleDto,
  ) {
    console.log('📩 [PUT /zone/setting/fog-cycle] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - fog cycle DTO:', plantFogCycleDto);

    const result = await this.plantService.fogCycleSetter(
      user.user_id, // ✅ userId 전달
      plantFogCycleDto,
    );

    console.log('   👉 fogCycleSetter 결과:', result);
    return result;
  }

  @UseGuards(AuthJwtGuard)
  @Put('/zone/setting/fog-power')
  @HttpCode(HttpStatus.OK)
  async setterFogPower(
    @CurrentUser() user: UserEntity,
    @Body() plantFogPowerDto: PlantFogPowerDto,
  ) {
    console.log('📩 [PUT /zone/setting/fog-power] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - fog power DTO:', plantFogPowerDto);

    const result = await this.plantService.fogPowerSetter(
      user.user_id, // ✅ userId 전달
      plantFogPowerDto,
    );

    console.log('   👉 fogPowerSetter 결과:', result);
    return result;
  }
}
