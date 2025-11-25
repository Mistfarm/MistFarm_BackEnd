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

@Controller()
@UseGuards(AuthJwtGuard)
export class ZoneController {
  constructor(
    private readonly zoneRegistrationService: ZoneRegistrationService,
    private readonly zoneDevCreateService: ZoneDevCreateService,
    private readonly zoneCreateService: ZoneCreateService,
    private readonly zoneListViewService: ZoneListViewService,
    private readonly zoneDeleteService: ZoneDeleteService,
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
}
