import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { TokenRepository } from './repository/token.repository';
import { TokenEntity } from './entity/token.entity';
import { ZoneRepository } from './repository/zone.repository';
import { ZoneEntity } from './entity/zone.entity';
import { DeviceEntity } from './entity/device.entity';
import { DeviceRepository } from './repository/device.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity, ZoneEntity, DeviceEntity])],
  providers: [UserRepository, TokenRepository, ZoneRepository, DeviceRepository],
  exports: [UserRepository, TokenRepository, ZoneRepository, DeviceRepository],
})
export class DataBaseModule {}
