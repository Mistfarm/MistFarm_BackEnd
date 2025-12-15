import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../../../DB/entity/device.entity';

@Injectable()
export class ZoneSocketService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async getDevicesStatus(zoneId: string) {
    const devices = await this.deviceRepository.find({
      where: { zoneId },
    });

    return devices.map((device) => ({
      deviceName: device.deviceName,
      connected: device.onConnect,
      lat: device.latitude,
      lon: device.longitude,
    }));
  }
}
