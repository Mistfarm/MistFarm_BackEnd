import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GrowthReportDto } from './dto/growth.report.dto';
import { AiService } from './ai.service';

@Controller()
export class AiController {
  constructor(private readonly AiService: AiService) {}

  @Put('/analysis/growth-report')
  async growthReport(@Body() growthReportDto: GrowthReportDto) {
    await this.AiService.growthReport(growthReportDto);
  }

  @Get('/zone/:zoneId')
  async findPlant(@Param('zoneId') zoneId: string) {
    return await this.AiService.findPlant(zoneId);
  }

  @Get('/all-zones')
  async findAllZones() {
    return await this.AiService.findAllZones();
  }
}
