import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DataBaseModule } from '../../DB/data.base.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [DataBaseModule],
})
export class AuthModule {}
