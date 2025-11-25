import { Injectable } from '@nestjs/common';
import { RawData, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { DeviceInfoDto } from './dto/device.info.dto';
import { DeviceRepository } from '../../DB/repository/device.repository';
import { DeviceEntity } from '../../DB/entity/device.entity';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}
  private connections = new Map<number, WebSocket>();
  connection(ws: WebSocket, req: IncomingMessage) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const deviceId = url.searchParams.get('device_id');
    if (!deviceId) {
      ws.send(JSON.stringify({ error: 'device_id가 없습니다.' }));
      ws.close(1008, 'device_id missing'); // 1008 = Policy Violation
      return;
    }
    const numberDeviceId = Number(deviceId);
    if (isNaN(numberDeviceId)) {
      ws.send(JSON.stringify({ error: 'device_id가 숫자가 아닙니다' }));
      ws.close(1008, 'device_id is not number'); // 1008 = Policy Violation
      return;
    }

    this.connections.set(numberDeviceId, ws);

    // 메시지 이벤트 직접 처리
    ws.on('message', (data) => {
      const deviceInfoDto = this.messageToDto(ws, data);
      this.deviceInfo(numberDeviceId, deviceInfoDto);
    });
    ws.on('close', () => {
      this.delete(numberDeviceId);
    });
  }
  messageToDto(ws: WebSocket, data: RawData): DeviceInfoDto {
    const inputString = JSON.stringify(data);
    const input = JSON.parse(inputString) as {
      type: string;
      data: number[];
    };
    //메세지 파싱
    const resultStr = input.data
      .map((num) => String.fromCharCode(num))
      .join('');
    //객체로
    const info = JSON.parse(resultStr) as DeviceInfoDto;
    //단 하나라도 0이 아니면서 nullable일때
    if (
      !info.type ||
      !info.payload ||
      (info.payload.lat !== 0 && !info.payload.lat) ||
      (info.payload.lon !== 0 && !info.payload.lon) ||
      (info.payload.humidity !== 0 && !info.payload.humidity) ||
      (info.payload.temperature !== 0 && !info.payload.temperature)
    )
      ws.send(JSON.stringify({ error: '400 Bad Request' }));
    return info;
  }
  deviceInfo(deviceId: number, deviceInfoDto: DeviceInfoDto) {
    const device = new DeviceEntity();
    device.deviceId = deviceId;
    device.humidity = deviceInfoDto.payload.humidity;
    device.temperature = deviceInfoDto.payload.temperature;
    device.latitude = deviceInfoDto.payload.lat;
    device.longitude = deviceInfoDto.payload.lon;

    this.deviceRepository.saveInfo(device);
  }
  delete(deviceId: number) {
    this.connections.delete(deviceId);
  }
}
