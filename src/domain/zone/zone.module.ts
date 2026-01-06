import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ZoneController } from './zone.controller';
import { ZoneEntity } from '../../DB/entity/zone.entity';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { ZoneRegistrationService } from './service/zone.registration.service';
import { ZoneDevCreateService } from './service/zone.dev.create.service';
import { ZoneCreateService } from './service/zone.create.service';
import { ZoneListViewService } from './service/zone.listview.service';
import { ZoneDeleteService } from './service/zone.delete.service';
import { DeviceRepository } from '../../DB/repository/device.repository';
import { ZoneDeviceListService } from './service/zone.device.list.service';
import { DeviceDeleteByZoneService } from './service/zone.device.delete.service';
import { DeviceUpdateZoneService } from './service/device.update-zone.service';
import { DevicesDevCreateService } from './service/device.dev-create.service';
import { ZoneDeviceGateway } from './zone.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../../DB/repository/user.repository';
import { UserEntity } from '../../DB/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZoneEntity, UserEntity]),
    ConfigModule, // ConfigService 사용을 위해 필요
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), // .env JWT_SECRET 사용
      }),
    }),
  ],
  controllers: [ZoneController],
  providers: [
    ZoneRepository,
    ZoneRegistrationService,
    ZoneDevCreateService,
    ZoneCreateService,
    ZoneListViewService,
    ZoneDeleteService,
    ZoneDeviceListService,
    DeviceRepository,
    DeviceDeleteByZoneService,
    DeviceUpdateZoneService,
    DevicesDevCreateService,
    ZoneDeviceGateway,
    UserRepository,
  ],
  exports: [ZoneRepository], // 다른 모듈에서 사용할 경우
})
export class ZoneModule {}
