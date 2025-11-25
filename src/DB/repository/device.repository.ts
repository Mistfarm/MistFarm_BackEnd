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

  async findByDeviceId(deviceId: string): Promise<DeviceEntity | null> {
    return this.findOne({ where: { deviceId } });
  }

  async createDevice(device: DeviceEntity): Promise<DeviceEntity> {
    const newDevice = this.create(device);
    return this.save(newDevice);
  }

  async deleteDevice(id: string): Promise<boolean> {
    const result = await this.delete({ deviceId: id });
    return (result.affected ?? 0) > 0;
  }

  async existsByDeviceId(deviceId: string): Promise<boolean> {
    const count = await this.count({ where: { deviceId } });
    return count > 0;
  }
}