import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { ZoneEntity } from '../../DB/entity/zone.entity';
import { DeviceService } from './device.service';
import { DeviceRepository } from '../../DB/repository/device.repository';

@EventSubscriber()
export class DeviceSubscriber implements EntitySubscriberInterface<ZoneEntity> {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly deviceRepository: DeviceRepository,
  ) {}
  listenTo() {
    return ZoneEntity; // User 엔티티만 구독
  }

  afterUpdate(event: UpdateEvent<ZoneEntity>) {
    // 이번 업데이트에서 어떤 컬럼이 바뀌었는지 확인
    const updatedCols = event.updatedColumns.map((col) => col.propertyName);
    const entity = event.entity as ZoneEntity;
    // nutrient 변경 감지
    if (updatedCols.includes('nutrient')) {
      const newNutrient = entity.nutrient;
      this.onNutrientChange(entity.id, newNutrient);
    }

    //mode 변경감지
    if (updatedCols.includes('autoFogMode')) {
      const newMode = entity.autoFogMode;
      if (newMode) {
        const newFogOnTime = entity.autoFogOnTime;
        const newFogOffTime = entity.autoFogOffTime;
        this.onNotAutoFogChange(entity.id, newFogOnTime, newFogOffTime);
      } else {
        const newPower = entity.fogPower;
        this.onAutoFogChange(entity.id, newPower);
      }
    } else {
      // fogPower 변경 감지
      if (updatedCols.includes('fogPower')) {
        const newFogPower = entity.fogPower;
        this.onAutoFogChange(entity.id, newFogPower);
      }

      //fog-interval 변경감지
      if (
        updatedCols.includes('autoFogOnTime') ||
        updatedCols.includes('autoFogOffTime')
      ) {
        const newFogOnTime = entity.autoFogOnTime;
        const newFogOffTime = entity.autoFogOffTime;
        this.onNotAutoFogChange(entity.id, newFogOnTime, newFogOffTime);
      }
    }
  }

  // nutrient 변경 함수
  onNutrientChange(zoneId: string, newValue: number | undefined) {
    void this.deviceRepository.findByZoneId(zoneId).then((devices) => {
      devices.forEach((device) => {
        this.deviceService.sand<{ nutrient: number | undefined }>(
          device.deviceId,
          'set-nutrient-ratio',
          { nutrient: newValue },
        );
      });
    });
  }

  // fogPower 변경 함수
  onAutoFogChange(zoneId: string, newValue: boolean | undefined) {
    void this.deviceRepository.findByZoneId(zoneId).then((devices) => {
      devices.forEach((device) => {
        this.deviceService.sand<{ mode: number; power: number | undefined }>(
          device.deviceId,
          'set-fog-mode',
          { mode: 0, power: newValue ? 1 : 0 },
        );
      });
    });
  }

  onNotAutoFogChange(
    zoneId: string,
    newOnValue: string | undefined,
    newOffValue: string | undefined,
  ) {
    void this.deviceRepository.findByZoneId(zoneId).then((devices) => {
      devices.forEach((device) => {
        this.deviceService.sand<{
          mode: number;
          onInterval: string | undefined;
          offInterval: string | undefined;
        }>(device.deviceId, 'set-fog-mode', {
          mode: 1,
          onInterval: newOnValue,
          offInterval: newOffValue,
        });
      });
    });
  }
}
