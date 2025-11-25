export class DeviceInfoDto {
  type: string;
  payload: {
    lat: number;
    lon: number;
    humidity: number;
    temperature: number;
  };
}
