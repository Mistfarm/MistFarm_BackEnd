import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { DeviceEntity } from '../entity/device.entity';

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
    if (!device.deviceName) {
      const count = await this.count();
      device.deviceName = `기기${count + 1}`;
    }
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

  async disconnectDevice(deviceId: number) {
    await this.update({ deviceId }, { onConnect: false });
  }

  async connectDevice(deviceId: number) {
    await this.update({ deviceId }, { onConnect: true });
  }

  async saveInfo(info: {
    deviceId: number;
    humidity: number;
    temperature: number;
    latitude: number;
    longitude: number;
  }) {
    const device = await this.findOneBy({ deviceId: info.deviceId });
    if (device) {
      device.humidity = info.humidity;
      device.temperature = info.temperature;
      device.latitude = info.latitude;
      device.longitude = info.longitude;
      return this.save(device);
    } else {
      const newDevice = new DeviceEntity();
      newDevice.deviceId = info.deviceId;
      newDevice.humidity = info.humidity;
      newDevice.temperature = info.temperature;
      newDevice.latitude = info.latitude;
      newDevice.longitude = info.longitude;
      return this.createDevice(newDevice);
    }
  }

  async saveGrowthLevel(deviceId: number, growthLevel: number) {
    const device = await this.findOne({ where: { deviceId } });
    if (device) {
      device.growthLevel = growthLevel;
      void this.save(device);
    }
  async deleteByZoneAndDeviceIds(
    zoneId: string,
    deviceIds: number[],
  ): Promise<number> {
    const result = await this.delete({
      zoneId,
      deviceId: In(deviceIds),
    });
    return result.affected ?? 0; // 삭제된 개수 반환
  }

  async moveDevicesToZone(
    fromZoneId: string,
    toZoneId: string,
  ): Promise<number> {
    const result = await this.createQueryBuilder()
      .update()
      .set({ zoneId: toZoneId })
      .where('zoneId = :fromZoneId', { fromZoneId })
      .execute();

    return result.affected ?? 0;
  }

  async updateZoneForUnusedDevices(
    deviceNames: string[],
    newZoneId: string,
  ): Promise<number> {
    const result = await this.createQueryBuilder()
      .update(DeviceEntity)
      .set({ zoneId: newZoneId })
      .where({ deviceName: In(deviceNames) })
      .andWhere('zone_id = :unusedZoneId', { unusedZoneId: newZoneId }) // 안전하게 조건 걸 수 있음
      .execute();

    return result.affected ?? 0;
  }

  async findDevicesByIds(deviceIds: string[]): Promise<DeviceEntity[]> {
    return this.find({ where: { deviceId: In(deviceIds) } });
  }

  async findDevicesEligibleForMove(names: string[], userId: string) {
    return this.createQueryBuilder('device')
      .innerJoinAndSelect('device.zone', 'zone')
      .where('device.deviceName IN (:...names)', { names })
      .andWhere('zone.userId = :userId', { userId })
      .andWhere('zone.zoneName = :zoneName', {
        zoneName: '사용하지 않는 기기 모음',
      })
      .andWhere('zone.isNotUsed = true')
      .getMany();
  }
}
