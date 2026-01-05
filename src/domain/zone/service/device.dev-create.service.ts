import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeviceRepository } from '../../../DB/repository/device.repository';
import { DevicesResponse } from '../dto/device.list.dto';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../../DB/entity/user.entity';

@Injectable()
export class DevicesDevCreateService {
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private configService: ConfigService,
  ) {}

  async createDevices(
    devicesResponse: DevicesResponse,
    user: UserEntity,
  ): Promise<void> {
    if (user.user_id != this.configService.get<string>('DEV')) {
      throw new UnauthorizedException();
    }

    const devices = devicesResponse.devices.map((device) => ({
      deviceId: device.devicesId,
      name: device.name,
    }));

    await this.deviceRepo.createDevices(devices);
  }
}
