import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DataBaseModule } from '../../DB/data.base.module';
import { AuthTokenService } from './jwt/auth.token.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtStrategy } from './jwt/auth.jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService, AuthJwtStrategy],
  imports: [
    DataBaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
})
export class AuthModule {}
