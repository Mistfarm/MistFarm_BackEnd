import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { ZoneEntity } from '../../DB/entity/zone.entity';
import { DeviceService } from './device.service';
import { Injectable } from '@nestjs/common';
import { DeviceEntity } from '../../DB/entity/device.entity';

@Injectable()
@EventSubscriber()
export class DeviceSubscriber implements EntitySubscriberInterface<ZoneEntity> {
  constructor() {}

  listenTo() {
    return ZoneEntity;
  }

  async afterUpdate(event: UpdateEvent<ZoneEntity>) {
    const updatedCols = event.updatedColumns.map((col) => col.propertyName);
    const entity = event.entity as ZoneEntity;

    if (updatedCols.includes('nutrient')) {
      const newNutrient = entity.nutrient;
      await this.onNutrientChange(event, entity.zoneId, newNutrient);
    }

    if (updatedCols.includes('autoFogMode')) {
      const newMode = entity.autoFogMode;
      if (newMode) {
        const newFogOnTime = entity.autoFogOnTime;
        const newFogOffTime = entity.autoFogOffTime;
        await this.onNotAutoFogChange(
          event,
          entity.zoneId,
          newFogOnTime,
          newFogOffTime,
        );
      } else {
        const newPower = entity.fogPower;
        await this.onAutoFogChange(event, entity.zoneId, newPower);
      }
    } else {
      if (updatedCols.includes('fogPower')) {
        const newFogPower = entity.fogPower;
        await this.onAutoFogChange(event, entity.zoneId, newFogPower);
      }

      if (
        updatedCols.includes('autoFogOnTime') ||
        updatedCols.includes('autoFogOffTime')
      ) {
        const newFogOnTime = entity.autoFogOnTime;
        const newFogOffTime = entity.autoFogOffTime;
        await this.onNotAutoFogChange(
          event,
          entity.zoneId,
          newFogOnTime,
          newFogOffTime,
        );
      }
    }
  }

  async onNutrientChange(
    event: UpdateEvent<ZoneEntity>,
    zoneId: string,
    newValue: number | undefined,
  ) {
    const devices = await event.manager.find(DeviceEntity, {
      where: { zoneId },
    });

    const deviceService = DeviceService.getInstance();
    if (!deviceService) {
      console.warn('DeviceService not initialized yet');
      return;
    }

    devices.forEach((device) => {
      deviceService.send<{ nutrient: number | undefined }>(
        device.deviceId,
        'set-nutrient-ratio',
        { nutrient: newValue },
      );
    });
  }

  async onAutoFogChange(
    event: UpdateEvent<ZoneEntity>,
    zoneId: string,
    newValue: boolean | undefined,
  ) {
    const devices = await event.manager.find(DeviceEntity, {
      where: { zoneId },
    });

    const deviceService = DeviceService.getInstance();
    if (!deviceService) {
      console.warn('DeviceService not initialized yet');
      return;
    }

    devices.forEach((device) => {
      deviceService.send<{ mode: number; power: number | undefined }>(
        device.deviceId,
        'set-fog-mode',
        { mode: 0, power: newValue ? 1 : 0 },
      );
    });
  }

  async onNotAutoFogChange(
    event: UpdateEvent<ZoneEntity>,
    zoneId: string,
    newOnValue: string | undefined,
    newOffValue: string | undefined,
  ) {
    const devices = await event.manager.find(DeviceEntity, {
      where: { zoneId },
    });

    const deviceService = DeviceService.getInstance();
    if (!deviceService) {
      console.warn('DeviceService not initialized yet');
      return;
    }

    devices.forEach((device) => {
      deviceService.send<{
        mode: number;
        onInterval: string | undefined;
        offInterval: string | undefined;
      }>(device.deviceId, 'set-fog-mode', {
        mode: 1,
        onInterval: newOnValue,
        offInterval: newOffValue,
      });
    });
  }
}
