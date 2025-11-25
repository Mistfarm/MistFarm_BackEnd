import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ZoneController } from './zone.controller';
import { ZoneEntity } from '../../DB/entity/zone.entity';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { ZoneRegistrationService } from './service/zone.registration.service';
import { ZoneDevCreateService } from './service/zone.dev.create.service';
import { ZoneCreateService } from './service/zone.create.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZoneEntity]),
    ConfigModule, // ConfigService 사용을 위해 필요
  ],
  controllers: [ZoneController],
  providers: [
    ZoneRepository,
    ZoneRegistrationService,
    ZoneDevCreateService,
    ZoneCreateService,
  ],
  exports: [ZoneRepository], // 다른 모듈에서 사용할 경우
})
export class ZoneModule {}
