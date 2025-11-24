import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { TokenRepository } from './repository/token.repository';
import { TokenEntity } from './entity/token.entity';
import { ZoneRepository } from './repository/zone.repository';
import { ZoneEntity } from './entity/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity, ZoneEntity])],
  providers: [UserRepository, TokenRepository, ZoneRepository],
  exports: [UserRepository, TokenRepository, ZoneRepository],
})
export class DataBaseModule {}
