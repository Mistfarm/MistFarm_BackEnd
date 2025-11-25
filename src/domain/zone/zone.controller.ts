import {
  Body,
  Controller,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ZoneRegistrationDto } from './dto/zone.registration.dto';
import { CurrentUser } from '../auth/decorater/decorator.user';
import { UserEntity } from '../../DB/entity/user.entity';
import { ZoneRegistrationService } from './service/zone.registration.service';
import { ZoneDevCreateService } from './service/zone.dev.create.service';
import { ZoneDevCreateDto } from './dto/zone.dev.create.dto';
import { AuthJwtGuard } from '../auth/jwt/auth.jwt.guard';
import { ZoneCreateDto } from './dto/zone.create.dto';
import { ZoneCreateService } from './service/zone.create.service';

@Controller()
@UseGuards(AuthJwtGuard)
export class ZoneController {
  constructor(
    private readonly zoneRegistrationService: ZoneRegistrationService,
    private readonly zoneDevCreateService: ZoneDevCreateService,
    private readonly zoneCreateService: ZoneCreateService,
  ) {}

  @Post('/zone/developer/I-am-so-happy')
  @HttpCode(HttpStatus.CREATED)
  async createDevZone(
    @CurrentUser() user: UserEntity,
    @Body() zoneDevCreateDto: ZoneDevCreateDto,
  ): Promise<void> {
    await this.zoneDevCreateService.createDevZone(
      user.user_id,
      zoneDevCreateDto,
    );
  }

  @Put('/zone')
  @HttpCode(HttpStatus.OK)
  async registerZone(
    @CurrentUser() user: UserEntity,
    @Body() registrationDto: ZoneRegistrationDto,
  ): Promise<void> {
    await this.zoneRegistrationService.registerZone(user.id, registrationDto);
  }

  @Post('/zone')
  async createZone(
    @CurrentUser() user: UserEntity,
    @Body() zoneCreateDto: ZoneCreateDto,
  ): Promise<void> {
    await this.zoneCreateService.createZone(user.user_id, zoneCreateDto);
  }
}
