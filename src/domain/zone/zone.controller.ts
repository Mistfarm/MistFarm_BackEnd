import {
  Body,
  Controller,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ZoneRegistrationDto } from './dto/zone.registration.dto';
import { CurrentUser } from '../auth/decorater/decorator.user';
import { UserEntity } from '../../DB/entity/user.entity';
import { ZoneRegistrationService } from './service/zone.registration.service';
import { ZoneDevCreateService } from './service/zone.dev.create.service';
import { ZoneDevCreateDto } from './dto/zone.dev.create.dto';
import { AuthJwtGuard } from '../auth/jwt/auth.jwt.guard';
import { ZoneCreateService } from './service/zone.create.service';
import { ZoneCreateDto } from './dto/zone.create.dto';
import { ZonesResponse } from './dto/zone.listview.dto';
import { ZoneListViewService } from './service/zone.listview.service';
import { ZoneDeleteDto } from './dto/zone.delete.dto';
import { ZoneDeleteService } from './service/zone.delete.service';
import { DevicesResponse } from './dto/device.list.dto';
import { ZoneDeviceListService } from './service/zone.device.list.service';
import { DeviceDeleteByZoneDto } from './dto/zone.device.delete.dto';
import { DeviceDeleteByZoneService } from './service/zone.device.delete.service';
import { DeviceUpdateZoneDto } from './dto/device.update-zone.dto';
import { DeviceUpdateZoneService } from './service/device.update-zone.service';
import { DevicesDevCreateService } from './service/device.dev-create.service';

@Controller()
@UseGuards(AuthJwtGuard)
export class ZoneController {
  constructor(
    private readonly zoneRegistrationService: ZoneRegistrationService,
    private readonly zoneDevCreateService: ZoneDevCreateService,
    private readonly zoneCreateService: ZoneCreateService,
    private readonly zoneListViewService: ZoneListViewService,
    private readonly zoneDeleteService: ZoneDeleteService,
    private readonly zoneDeviceListService: ZoneDeviceListService,
    private readonly deviceDeleteService: DeviceDeleteByZoneService,
    private readonly deviceUpdateService: DeviceUpdateZoneService,
    private readonly createDevices: DevicesDevCreateService,
  ) {
    console.log('🏢 ZoneController 로드됨');
  }

  @Post('/zone/developer/I-am-so-happy')
  @HttpCode(HttpStatus.CREATED)
  async createDevZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneDevCreateDto,
  ): Promise<void> {
    console.log('📩 [POST /zone/developer/I-am-so-happy] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    await this.zoneDevCreateService.createDevZone(user.user_id, dto);

    console.log('   👉 createDevZone 완료');
  }

  @Put('/zone')
  @HttpCode(HttpStatus.OK)
  async registerZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneRegistrationDto,
  ): Promise<void> {
    console.log('📩 [PUT /zone] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    await this.zoneRegistrationService.registerZone(user.user_id, dto);

    console.log('   👉 registerZone 완료');
  }

  @Post('/zone')
  @HttpCode(HttpStatus.OK)
  async createZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneCreateDto,
  ): Promise<void> {
    console.log('📩 [POST /zone] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    await this.zoneCreateService.createZone(user.user_id, dto);

    console.log('   👉 createZone 완료');
  }

  @Get('/zones')
  @HttpCode(HttpStatus.OK)
  async getZones(@CurrentUser() user: UserEntity): Promise<ZonesResponse> {
    console.log('📩 [GET /zones] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);

    const result = await this.zoneListViewService.getZoneList(user.user_id);

    console.log('   👉 getZoneList 결과:', result);
    return result;
  }

  @Delete('/zone')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteZone(
    @Body() dto: ZoneDeleteDto,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    console.log('📩 [DELETE /zone] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    await this.zoneDeleteService.deleteZone(user.user_id, dto);

    console.log('   👉 deleteZone 완료');
  }

  @Get('/zone/devices')
  @HttpCode(HttpStatus.OK)
  async getDevices(
    @CurrentUser() user: UserEntity,
    @Query('zone-id') zoneId: string,
  ): Promise<DevicesResponse> {
    console.log('📩 [GET /zone/devices] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - zoneId:', zoneId);

    // zone-id가 없으면 에러
    if (!zoneId) {
      throw new BadRequestException('zone-id 파라미터가 필요합니다.');
    }

    const result = await this.zoneDeviceListService.getZoneDevicesByZone(
      user.user_id,
      zoneId,
    );

    console.log('   👉 getZoneDevicesByZone 결과:', result);
    return result;
  }

  @Delete('/zone/devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDevices(
    @CurrentUser() user: UserEntity,
    @Body() dto: DeviceDeleteByZoneDto,
  ): Promise<void> {
    console.log('📩 [DELETE /zone/devices] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    await this.deviceDeleteService.deleteDevices(user.user_id, dto);

    console.log('   👉 deleteDevices 완료');
  }

  @Put('/zone/devices')
  @HttpCode(HttpStatus.OK)
  async updateDeviceZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: DeviceUpdateZoneDto,
  ): Promise<void> {
    console.log('📩 [PUT /zone/devices] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    await this.deviceUpdateService.updateDeviceZone(user.user_id, dto);

    console.log('   👉 updateDeviceZone 완료');
  }

  @Post('/zone/devices')
  @HttpCode(HttpStatus.OK)
  async createDevDevice(
    @CurrentUser() user: UserEntity,
    @Body() dto: DevicesResponse,
  ): Promise<void> {
    console.log('📩 [POST /zone/devices] 요청 수신');
    console.log('   - 현재 유저:', user.user_id);
    console.log('   - DTO:', dto);

    await this.createDevices.createDevices(dto, user);

    console.log('   👉 createDevices 완료');
  }
}
