import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Device } from './device.entity';

@Injectable()
export class DeviceRepository extends Repository<Device> {
  constructor(private dataSource: DataSource) {
    super(Device, dataSource.createEntityManager());
  }

  // 장치 조회 by zone
  async findByZoneId(zoneId: string): Promise<Device[]> {
    return this.find({ where: { zone_id: zoneId } });
  }

  // 단일 장치 조회
  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return this.findOne({ where: { device_id: deviceId } });
  }

  // 장치 생성
  async createDevice(device: Partial<Device>): Promise<Device> {
    const newDevice = this.create(device);
    return this.save(newDevice);
  }

  // 장치 삭제
  async deleteDevice(id: string): Promise<void> {
    await this.delete({ id });
  }
}
