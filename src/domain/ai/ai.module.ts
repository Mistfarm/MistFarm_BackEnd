import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { DataBaseModule } from '../../DB/data.base.module';

@Module({
  providers: [AiService],
  controllers: [AiController],
  imports: [DataBaseModule],
})
export class AiModule {}
