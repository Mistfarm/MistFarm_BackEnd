import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { TokenRepository } from './repository/token.repository';
import { TokenEntity } from './entity/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity])],
  providers: [UserRepository, TokenRepository],
  exports: [UserRepository, TokenRepository],
})
export class DataBaseModule {}
