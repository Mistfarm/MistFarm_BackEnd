import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { ZoneEntity } from '../../DB/entity/zone.entity';
import { DeviceService } from './device.service';
import { Injectable } from '@nestjs/common';
import { DeviceEntity } from '../../DB/entity/device.entity';

interface NutrientPayload {
  nutrient: number | undefined;
}

interface FogModePayload {
  mode: number;
  power?: number;
  onInterval?: string;
  offInterval?: string;
}

@Injectable()
@EventSubscriber()
export class DeviceSubscriber implements EntitySubscriberInterface<ZoneEntity> {
  constructor() {
    console.log('📡 DeviceSubscriber 초기화됨');
  }

  listenTo() {
    return ZoneEntity;
  }

  async afterUpdate(event: UpdateEvent<ZoneEntity>): Promise<void> {
    const updatedCols = event.updatedColumns.map((col) => col.propertyName);
    const entity = event.entity as ZoneEntity;

    console.log('📝 [SUBSCRIBER] Zone 업데이트 감지');
    console.log('   - zoneId:', entity.zoneId);
    console.log('   - 변경된 컬럼:', updatedCols);

    if (updatedCols.includes('nutrient')) {
      const newNutrient = entity.nutrient;
      console.log('   - nutrient 변경:', newNutrient);
      await this.onNutrientChange(event, entity.zoneId, newNutrient);
    }

    if (updatedCols.includes('autoFogMode')) {
      const newMode = entity.autoFogMode;
      console.log('   - autoFogMode 변경:', newMode);

      if (newMode) {
        const newFogOnTime = entity.autoFogOnTime;
        const newFogOffTime = entity.autoFogOffTime;
        await this.onAutoFogCycleChange(
          event,
          entity.zoneId,
          newFogOnTime,
          newFogOffTime,
        );
      } else {
        const newPower = entity.fogPower;
        await this.onManualFogChange(event, entity.zoneId, newPower);
      }
    } else {
      if (updatedCols.includes('fogPower')) {
        const newFogPower = entity.fogPower;
        console.log('   - fogPower 변경:', newFogPower);
        await this.onManualFogChange(event, entity.zoneId, newFogPower);
      }

      if (
        updatedCols.includes('autoFogOnTime') ||
        updatedCols.includes('autoFogOffTime')
      ) {
        const newFogOnTime = entity.autoFogOnTime;
        const newFogOffTime = entity.autoFogOffTime;
        console.log('   - fog cycle 변경:', { newFogOnTime, newFogOffTime });
        await this.onAutoFogCycleChange(
          event,
          entity.zoneId,
          newFogOnTime,
          newFogOffTime,
        );
      }
    }
  }

  private async onNutrientChange(
    event: UpdateEvent<ZoneEntity>,
    zoneId: string,
    newValue: number | undefined,
  ): Promise<void> {
    console.log('🧪 [SUBSCRIBER] nutrient 변경 처리');
    console.log('   - zoneId:', zoneId);
    console.log('   - newValue:', newValue);

    const devices = await event.manager.find(DeviceEntity, {
      where: { zoneId },
    });

    console.log('   - 대상 디바이스 수:', devices.length);

    const deviceService = DeviceService.getInstance();
    if (!deviceService) {
      console.warn('⚠️ DeviceService not initialized yet');
      return;
    }

    devices.forEach((device) => {
      console.log(`   - 전송: ${device.deviceId} -> set-nutrient-ratio`);
      deviceService.send<NutrientPayload>(
        device.deviceId,
        'set-nutrient-ratio',
        { nutrient: newValue },
      );
    });
  }

  private async onManualFogChange(
    event: UpdateEvent<ZoneEntity>,
    zoneId: string,
    newValue: boolean | undefined,
  ): Promise<void> {
    console.log('💨 [SUBSCRIBER] 수동 fog 모드 변경 처리');
    console.log('   - zoneId:', zoneId);
    console.log('   - power:', newValue);

    const devices = await event.manager.find(DeviceEntity, {
      where: { zoneId },
    });

    console.log('   - 대상 디바이스 수:', devices.length);

    const deviceService = DeviceService.getInstance();
    if (!deviceService) {
      console.warn('⚠️ DeviceService not initialized yet');
      return;
    }

    devices.forEach((device) => {
      console.log(`   - 전송: ${device.deviceId} -> set-fog-mode (manual)`);
      deviceService.send<FogModePayload>(device.deviceId, 'set-fog-mode', {
        mode: 0,
        power: newValue ? 1 : 0,
      });
    });
  }

  private async onAutoFogCycleChange(
    event: UpdateEvent<ZoneEntity>,
    zoneId: string,
    newOnValue: string | undefined,
    newOffValue: string | undefined,
  ): Promise<void> {
    console.log('🔄 [SUBSCRIBER] 자동 fog 사이클 변경 처리');
    console.log('   - zoneId:', zoneId);
    console.log('   - onInterval:', newOnValue);
    console.log('   - offInterval:', newOffValue);

    const devices = await event.manager.find(DeviceEntity, {
      where: { zoneId },
    });

    console.log('   - 대상 디바이스 수:', devices.length);

    const deviceService = DeviceService.getInstance();
    if (!deviceService) {
      console.warn('⚠️ DeviceService not initialized yet');
      return;
    }

    devices.forEach((device) => {
      console.log(`   - 전송: ${device.deviceId} -> set-fog-mode (auto)`);
      deviceService.send<FogModePayload>(device.deviceId, 'set-fog-mode', {
        mode: 1,
        onInterval: newOnValue,
        offInterval: newOffValue,
      });
    });
  }
}
