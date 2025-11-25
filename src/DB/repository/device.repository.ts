import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { CreateDeviceDto } from '../../domain/device/dto/create-device.dto';

@Injectable()
export class DeviceRepository extends Repository<DeviceEntity> {
  constructor(private dataSource: DataSource) {
    super(DeviceEntity, dataSource.createEntityManager());
  }

  async findByZoneId(zoneId: string): Promise<DeviceEntity[]> {
    return this.find({ where: { zoneId } });
  }

  async findByDeviceName(deviceName: string): Promise<DeviceEntity | null> {
    return this.findOne({ where: { deviceName } });
  }

  async createDevice(device: DeviceEntity): Promise<DeviceEntity> {
    const newDevice = this.create(device);
    return this.save(newDevice);
  }

  async deleteDevice(deviceId: number): Promise<boolean> {
    const result = await this.delete({ deviceId });
    return (result.affected ?? 0) > 0;
  }

  async existsByDeviceName(deviceName: string): Promise<boolean> {
    const count = await this.count({ where: { deviceName } });
    return count > 0;
  }
}