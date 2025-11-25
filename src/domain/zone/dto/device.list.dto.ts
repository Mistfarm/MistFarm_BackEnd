import { IsNumber, IsString } from 'class-validator';

export class DeviceSummaryResponse {
  @IsNumber()
  devicesId: number;

  @IsString()
  name: string;
}

export class DevicesResponse {
  devices: DeviceSummaryResponse[];
}
