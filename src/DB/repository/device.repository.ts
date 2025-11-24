import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Device } from '../entity/device.entity';
import { CreateDeviceDto } from '../../domain/device/dto/create-device.dto';

@Injectable()
export class DeviceRepository extends Repository<Device> {
  constructor(private dataSource: DataSource) {
    super(Device, dataSource.createEntityManager());
  }

  async findByZoneId(zoneId: string): Promise<Device[]> {
    return this.find({ where: { zoneId } });
  }

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return this.findOne({ where: { deviceId } });
  }

  async createDevice(createDto: CreateDeviceDto): Promise<Device> {
    const newDevice = this.create(createDto);
    return this.save(newDevice);
  }

  async deleteDevice(id: string): Promise<boolean> {
    const result = await this.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async existsByDeviceId(deviceId: string): Promise<boolean> {
    const count = await this.count({ where: { deviceId } });
    return count > 0;
  }
}