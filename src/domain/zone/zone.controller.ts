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
  ) {}

  @Post('/zone/developer/I-am-so-happy')
  @HttpCode(HttpStatus.CREATED)
  async createDevZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneDevCreateDto,
  ): Promise<void> {
    await this.zoneDevCreateService.createDevZone(user.user_id, dto);
  }

  @Put('/zone')
  @HttpCode(HttpStatus.OK)
  async registerZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneRegistrationDto,
  ): Promise<void> {
    await this.zoneRegistrationService.registerZone(user.user_id, dto);
  }

  @Post('/zone')
  @HttpCode(HttpStatus.OK)
  async createZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: ZoneCreateDto,
  ) {
    await this.zoneCreateService.createZone(user.user_id, dto);
  }

  @Get('/zones')
  @HttpCode(HttpStatus.OK)
  async getZones(@CurrentUser() user: UserEntity): Promise<ZonesResponse> {
    return this.zoneListViewService.getZoneList(user.user_id);
  }

  @Delete('/zone')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteZone(
    @Body() dto: ZoneDeleteDto,
    @CurrentUser() user: UserEntity,
  ) {
    await this.zoneDeleteService.deleteZone(user.user_id, dto);
  }

  @Get('/zone/devices')
  async getDevices(
    @CurrentUser() user: UserEntity,
    @Query('zone-id') zoneId: string,
  ): Promise<DevicesResponse> {
    return this.zoneDeviceListService.getZoneDevicesByZone(
      user.user_id,
      zoneId,
    );
  }

  @Delete('/zone/devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDevices(
    @CurrentUser() user: UserEntity,
    @Body() dto: DeviceDeleteByZoneDto,
  ) {
    await this.deviceDeleteService.deleteDevices(user.user_id, dto);
  }

  @Put('/zone/devices')
  @HttpCode(HttpStatus.OK)
  async updateDeviceZone(
    @CurrentUser() user: UserEntity,
    @Body() dto: DeviceUpdateZoneDto,
  ) {
    await this.deviceUpdateService.updateDeviceZone(user.user_id, dto);
  }

  @Post('/zone/devices')
  @HttpCode(HttpStatus.OK)
  async createDevDevice(
    @CurrentUser() user: UserEntity,
    @Body() dto: DevicesResponse,
  ) {
    await this.createDevices.createDevices(dto, user);
  }
}
